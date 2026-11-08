import { Status } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { Staff, VerifyPayload } from "./staff.interface";
import { transporter } from "../../lib/nodemailer";
import config from "../../config";
import ejs from "ejs";
import { cloudinary } from "../../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { redisClient } from "../../lib/redis";
import path from "path";
import generateRandomPassword from "../../utils/randomPassword";
import bcrypt from "bcryptjs";

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
  const { name, email, role, departmentId, departmentRole, address } = payload;
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
      name,
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

const ApproviedStaff = async (id: string, status: Status) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      staff: true,
    },
  });
  const password = generateRandomPassword();
  if (status == "REJECTED") {
    const tempatePath = path.join(
      process.cwd(),
      "src/app/templates/staff-application-rejected.ejs"
    );
    const rejectedtemplateData = {
      fullName: user?.name,
      companyName: "City complaint and Services",
      rejectionReason: "Your submitted information could not be verified.",
    };
    const html = await ejs.renderFile(tempatePath, rejectedtemplateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: user?.email,
    subject: "Email Verification",
    html,
  });
  }
  const hashedpassword = await bcrypt.hash(
    password,
    config.bcrypt_salt_rounds as string
  );
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: status,
      isemailVerified: true,
      password: hashedpassword,
    },
  });
  const staff = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/staff-aproved-email.ejs"
  );

  const templateData = {
    fullName: staff?.name,
    email: staff?.email,
    role: staff?.role,
    temporaryPassword: password,
    loginUrl: "http://localhost:5000/api/auth/login",
    companyName: "City Complaint and Services",
  };

  const html = await ejs.renderFile(tempatePath, templateData);

  await transporter.sendMail({
    from: config.email_sender,
    to: staff?.email,
    subject: "Email Verification",
    html,
  });
  return null;
};
const verifyStaff = async (payload: VerifyPayload) => {
  const { email, otp } = payload;
  const staff_otp_key = `vefify_staff_otp_key_${email}`;

  const staffOptKey = await redisClient.get(staff_otp_key);
  if (staffOptKey !== otp) {
    throw new Error("plase provied valid OTP Key");
  }

  const verifyStaff = await prisma.user.update({
    where: {
      email,
    },
    data: {
      isemailVerified: true,
    },
  });

  const tempatePath = path.join(
    process.cwd(),
    "src/app/templates/staff-welcome-email.ejs"
  );

  const tempaltedata = {
    name: verifyStaff.name,
  };
  const html = await ejs.renderFile(tempatePath, tempaltedata);

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
    include: {
      staff: true,
    },
  });
  return result;
};

export const StaffServices = {
  getStaff,
  staffApplay,
  ApproviedStaff,
  deleteStaff,
  verifyStaff,
};
