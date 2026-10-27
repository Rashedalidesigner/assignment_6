/** biome-ignore-all lint/style/useConst: <explanation> */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ejs from "ejs";
import type { TokenPayload } from "google-auth-library";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import path from "path";
import {
  AuthProvider,
  UserRole,
  Status,
} from "../../../../prisma/generated/prisma/enums";
import config from "../../config";
import { googleClient } from "../../lib/googleAuth";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import type {
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  ILoginUserPayload,
  IRegistercitizenPayload,
  IRequestUser,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "./auth.interface";

const registerCitizen = async (payload: IRegistercitizenPayload) => {
  const { fullname, password,phone } = payload;

  const email = payload.email.trim().toLowerCase();

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const expirationSeconds = 5 * 60;
  const otpKey = `citizen-registration-otp:${email}`;
  const otpValue = crypto.randomInt(100000, 1000000).toString();

  if (config.node_env === "development") {
    console.log(`[dev] OTP ${email} : ${otpValue}`);
  }

  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  const citizenRegistrationKey = `citizen-registration-data:${email}`;
  const redisUserDataPayload = {
    fullname,
    email,
    password: hashedPassword,
    phone,
  };

  await redisClient.set(
    citizenRegistrationKey,
    JSON.stringify(redisUserDataPayload),
    {
      expiration: {
        type: "EX",
        value: expirationSeconds,
      },
    },
  );

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs",
  );

  const templateData = {
    fullname,
    email,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60,
  };

  const html = await ejs.renderFile(tempatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Email Verification",
    html,
  });
};

const verifyPatientEmail = async (payload: IVerifyEmailPayload) => {
  const otp = payload.otp;
  const email = payload.email.trim().toLowerCase();

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist?.status === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Blocked");
  }

  if (isUserExist?.isemailVerified) {
    throw new AppError(httpStatus.CONFLICT, "Email ALready Verified");
  }

  if ( isUserExist?.status === "DELETED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
  }

  const otpKey = `citizen-registration-otp:${email}`;

  const redisOtp = await redisClient.get(otpKey);

  if (!redisOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (redisOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP Does Not Match");
  }

  await redisClient.del(otpKey);

  const citizenRegistrationKey = `citizen-registration-data:${email}`;

  const rediscitizenData = await redisClient.get(citizenRegistrationKey);

  if (!rediscitizenData) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient Doesnt Exist");
  }

  const citizenPayload: IRegistercitizenPayload = JSON.parse(rediscitizenData);

  const createdUser = await prisma.user.create({
    data: {
      fullName: citizenPayload.fullname,
      email: citizenPayload.email,
      passwor: citizenPayload.password,
      role: UserRole.CITIZEN,
      status: Status.ACTIVE,
      isemailVerified: true,
    },
    omit: { passwor: true },
  });

  await redisClient.del(citizenRegistrationKey);

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/patient-welcome-email.ejs",
  );

  const templateData = {
    fullname: createdUser.fullName,
  };

  const html = await ejs.renderFile(tempatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Welcome To PH Healthcare System",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`
    html,
  });

  const { ...user } = createdUser;
  const jwtPayload = {
    userId: user.id,
    fullname: user.fullName,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: ILoginUserPayload) => {
  // throw new Error("Test Error");

  const { password } = payload;
  const email = payload.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // throw new Error("User not found");
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (user.status === Status.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  if ( user.status === Status.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  if (user.passwor === null && user.googleId !== null) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User Already Has Account Registered With Google. Try To Login With Google.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.passwor as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    userId: user.id,
    fullname: user.fullName,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    omit: {
      passwor: true,
    },
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return isUserExists;
};

const refreshToken = async (token: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      config.node_env === "development"
        ? verifiedRefreshToken.error
        : "Invalid refresh token",
    );
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user || user.status !== Status.ACTIVE) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User is inactive or not found",
    );
  }

  const jwtPayload = {
    userId: user.id,
    fullname: user.fullName,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const googleLogin = async (payload: IGoogleLoginPayload) => {
  let googleIdTokenPayload: TokenPayload | null | undefined = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config.google_client_id,
    });

    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google ID Token Verification Failed", error);
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid Or Expired Google Id Token",
    );
  }

  if (!googleIdTokenPayload) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid Or Expired Google Id Token",
    );
  }

  if (!googleIdTokenPayload.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Google Email Not Found");
  }
  if (!googleIdTokenPayload.name) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Google Email User Name Not Found",
    );
  }

  const ifcitizenExistWithGoogleAuth = await prisma.user.findUnique({
    where: {
      email: googleIdTokenPayload.email,
      role: UserRole.CITIZEN,
      googleId: googleIdTokenPayload.sub,
    },
  });

  let user = ifcitizenExistWithGoogleAuth;

  if (!ifcitizenExistWithGoogleAuth) {
    const ifPatientExistWithCredentials = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email,
        role: UserRole.CITIZEN,
        authProvider: AuthProvider.EMAIL,
      },
    });

    if (ifPatientExistWithCredentials) {
      if (!ifPatientExistWithCredentials.isemailVerified) {
        throw new AppError(httpStatus.FORBIDDEN, "Email Not Verified");
      }

      if (ifPatientExistWithCredentials.status === Status.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, "User Is Blocked");
      }

      if (ifPatientExistWithCredentials.status === Status.DELETED
      ) {
        throw new AppError(httpStatus.FORBIDDEN, "User Is Deleted");
      }

      user = await prisma.user.update({
        where: {
          id: ifPatientExistWithCredentials.id,
        },

        data: {
          googleId: googleIdTokenPayload.sub,
        },
      });
    } else {
      // Google Register
      user = await prisma.user.create({
        data: {
          fullName: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          role: UserRole.CITIZEN,
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.GOOGLE,
          isemailVerified: true,
        },
      });
      const tempatePath = path.join(
        process.cwd(),
        "src/app/templates/patient-welcome-email.ejs",
      );

      const templateData = {
        fullname: user.fullName,
      };

      const html = await ejs.renderFile(tempatePath, templateData);

      await transporter.sendMail({
        from: config.email_sender,
        to: user.email,
        subject: "Welcome To PH Healthcare System",
        // text : `Your OTP is ${otp}`
        // html: `<h1>Your OTP is ${otp}</h1>`
        html,
      });
    }
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (user.status === Status.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "User Is Blocked");
  }

  if ( user.status === Status.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, "User Is Deleted");
  }

  const jwtPayload = {
    userId: user.id,
    fullname: user.fullName,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const forgotPassword = async (payload: IForgotPasswordPayload) => {
  const { email } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Does Not Exist!");
  }

  if (isUserExist.status === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Blocked");
  }

  if (!isUserExist.isemailVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "User Not Verified");
  }

  if (isUserExist.status === "DELETED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
  }

  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(httpStatus.BAD_REQUEST, "User Has Account With Google");
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  if (config.node_env === "development")
    console.log(`[dev] Forgot-password OTP for ${email}: ${otp}`);

  const key = `forgor-password-otp:${isUserExist.email}`;

  const expirationSeconds = 5 * 60;

  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/forgot-password.ejs",
  );

  const templateData = {
    fullname: isUserExist.fullName,
    otp,
    expirationMinutes: expirationSeconds / 60,
  };

  const html = await ejs.renderFile(tempatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: isUserExist.email,
    subject: "Forgot Password",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`
    html,
  });
};

const resetPassword = async (payload: IResetPasswordPayload) => {
  const { email, otp, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Does Not Exist!");
  }

  if (isUserExist.status === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Blocked");
  }

  if (!isUserExist.isemailVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "User Not Verified");
  }

  if ( isUserExist.status === "DELETED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
  }

  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(httpStatus.BAD_REQUEST, "User Has Account With Google");
  }

  const key = `forgor-password-otp:${isUserExist.email}`;

  const redisOtp = await redisClient.get(key);

  if (!redisOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (redisOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP Does Not Match");
  }

  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      email: isUserExist.email,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  await redisClient.del([key]);

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/reset-password-success.ejs",
  );

  const templateData = {
    fullname: isUserExist.fullName,
  };

  const html = await ejs.renderFile(tempatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: isUserExist.email,
    subject: "Password Changed",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your Password Is Changed</h1>`
    html,
  });
};

export const AuthService = {
  registerCitizen,
  verifyPatientEmail,
  loginUser,
  getMe,
  refreshToken,
  googleLogin,
  forgotPassword,
  resetPassword,
};
