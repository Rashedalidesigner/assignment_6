import { Status } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { Staff,  VerifyPayload } from "./staff.interface";
import crypto from "crypto";
import { transporter } from "../../lib/nodemailer";
import config from "../../config";
import ejs from "ejs";
import { cloudinary } from "../../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { redisClient } from "../../lib/redis";
import path from "path";

const getStaff = async () => {
  const result = await prisma.departmentMembership.findMany({
    include: {
      user: true,
      department: true,
    },
  });
  return result;
};

const staffApplay = async (payload: Staff, file: Buffer) => {
  const {
    fullName,
    email,
    password,
    role,
    departmentId,
    departmentRole,
    address,
  } = payload;
  // console.log(file)
  const resumeUpload = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },

          async (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error("No result returned from Cloudinary"));
            }

            resolve(result);
          }
        )
        .end(file.buffer);
    }
  );

  const result = await prisma.user.create({
    data: {
      fullName,
      email,
      role,
      staff: {
        create: {
          departmentId,
          departmentRole,
          resumeId: resumeUpload.public_id,
          address,
        },
      },
    },
  });
  const staffdata = await prisma.user.findUnique({
    where: {
      id: result.id,
    },
    include: {
      staff: true,
    },
  });

  return staffdata;
};

const ApproviedStaff = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: Status.APROVED,
    },
  });
  const staff = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!staff?.isActive) {
    throw new Error("Staff are not active");
  }
  if (staff?.isemailVerified) {
    throw new Error("user Already Verified");
  }

  const staff_otp_key = `vefify_staff_otp_key_${staff.email}`;
  const staff_otp_value = crypto.randomInt(100000, 1000000);
  const expration = 60 * 60 * 24 * 7;

  await redisClient.set(staff_otp_key, staff_otp_value, {
    expiration: {
      type: "EX",
      value: expration,
    },
  });

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs"
  );

  const templateData = {
    fullname: staff.fullName,
    email: staff.email,
    otp: staff_otp_value,
    expirationMinutes: expration,
  };

  const html = await ejs.renderFile(tempatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: staff.email,
    subject: "Email Verification",
    html,
  });
  return null;
};
const ApproviedManager = async (id: string) => {
  const result = await prisma.departmentMembership.update({
    where: {
      id,
    },
    data: {
      status: Status.APROVED,
    },
  });
  const staff = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!staff?.isActive) {
    throw new Error("Staff are not active");
  }
  if (staff?.isemailVerified) {
    throw new Error("user Already Verified");
  }

  const staff_otp_key = `vefify_staff_otp_key_${staff.email}`;
  const staff_otp_value = crypto.randomInt(100000, 1000000);
  const expration = 60 * 60 * 24 * 7;

  await redisClient.set(staff_otp_key, staff_otp_value, {
    expiration: {
      type: "EX",
      value: expration,
    },
  });

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs"
  );

  const templateData = {
    fullname: staff.fullName,
    email: staff.email,
    otp: staff_otp_value,
    expirationMinutes: expration,
  };

  const html = await ejs.renderFile(tempatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: staff.email,
    subject: "Email Verification",
    html,
  });
  return result;
};

const verifyStaff = async (payload:VerifyPayload) => {
  const {email,otp} = payload;
    const staff_otp_key = `vefify_staff_otp_key_${email}`;

  const staffOptKey = await redisClient.get(staff_otp_key);
  if(staffOptKey!==otp){
    throw new Error("plase provied valid OTP Key");
  }

  const verifyStaff = await prisma.user.update({
    where:{
      email
    },
    data:{
      isemailVerified:true
    }
  });

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/staff-welcome-email.ejs"
  );

  const tempaltedata = {
    fullname:verifyStaff.fullName
  }
  const html = await ejs.renderFile(tempatePath,tempaltedata);

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Email Verification",
    html,
  });
  return verifyStaff;
};

const deleteStaff = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
    include:{
      staff:true
    }
  });
  return result;
};

export const StaffServices = {
  getStaff,
  staffApplay,
  ApproviedStaff,
  ApproviedManager,
  deleteStaff,
  verifyStaff,
};
