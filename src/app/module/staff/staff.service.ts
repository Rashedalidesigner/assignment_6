import { Status, UserRole } from "../../../../prisma/generated/prisma/enums";
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
  const { name, email, departmentId, departmentRole, address } = payload;
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
      role:UserRole.DEPARTMENT_STAFF,
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

  return result;
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
  if (status == "REJECTED"|| status=="BLOCKED"||status=="DELETED"||status=="PANDING") {
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
    Number(config.bcrypt_salt_rounds)
  );
  console.log(status)
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
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
};
