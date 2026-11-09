import bcrypt from "bcryptjs";
import { Status, UserRole } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ITechnician, ItechnicianInfo } from "./technician.interface";
import config from "../../config";
import generateRandomPassword from "../../utils/randomPassword";
import path from "path";
import ejs from "ejs";
import { transporter } from "../../lib/nodemailer";

const getTechnician = async () => {
  const technician = await prisma.technician.findMany({
    include: {
      user: true,
    },
  });
  return technician;
};

const getTechnicianById = async (id: string) => {
  const technician = await prisma.technician.findUnique({
    where: {
      id,
    },
  });
  return technician;
};

const applayTechnician = async (data: ITechnician) => {
  const { name, email, experienceYears, specialization, phone } = data;
  const userExits = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExits) {
    throw new Error("User Already Exits");
  }

  // console.log(name)
  const technician = await prisma.user.create({
    data: {
      name: name,
      email,
      role:UserRole.TECHNICIAN,
      phone,
      technician: {
        create: {
          experienceYears,
          specialization,
        },
      },
    },
  });
  return technician;
};

const approviedTechnician = async (
  id: string,
  email: string,
  status: Status
) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      technician: true,
    },
  });

  if (status == "REJECTED") {
    const templatePath = path.join(
      process.cwd(),
      "src/app/templates/technician-rejected-email.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      fullName: user?.name,
      email: user?.email,
      role: user?.role,
      companyName: "City Complaint Services",
      rejectionReason: "Your submitted information could not be verified.",
    });

    await transporter.sendMail({
      from: config.email_sender,
      to: email,
      subject: "Email Verification",
      html,
    });
  }
  const password = generateRandomPassword();
  const hashedpassword = bcrypt.hashSync(password,Number(config.bcrypt_salt_rounds ))
  const approvied = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: status,
      isemailVerified: true,
      password: hashedpassword,
    },
  });
  const templatePath = path.join(
    process.cwd(),
    "src/app/templates/technician-welcome-email.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    name: approvied.name,
    email: email,
    employeeId: id,
    password: password,
    loginUrl: "http://localhost:5000/api/auth/login",
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Email Verification",
    html,
  });
};

const deleteTechnician = async (id: string) => {
  const technician = await prisma.technician.delete({
    where: {
      id,
    },
  });
  return technician;
};

export const TechnicianService = {
  getTechnician,
  getTechnicianById,
  applayTechnician,
  approviedTechnician,
  deleteTechnician,
};
