import bcrypt from "bcryptjs";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ITechnician, ItechnicianInfo } from "./technician.interface";
import config from "../../config";
import generateRandomPassword from "../../utils/randomPassword";
import path from "path";
import ejs from "ejs";
import { transporter } from "../../lib/nodemailer";

const getTechnician = async () => {
  const technician = await prisma.technician.findMany();
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

const applayTechnician = async(data:ITechnician) =>{
  const {fullname,email,experienceYears,specialization,phone}= data;
  const userExits = await prisma.user.findUnique({
    where:{
      email
    }
  });

  if(userExits){
    throw new Error("User Already Exits");
  }
  const technician = await prisma.user.create({
    data:{
      fullName:fullname,
      email,
      role: UserRole.TECHNICIAN,
      phone,
      technician:{
        create:{
          experienceYears,
          specialization,
        }
      }
    }
  });
  return technician;
}

const approviedTechnician = async (data:ItechnicianInfo)=>{
  const password = generateRandomPassword();
  const hashedpassword = await bcrypt.hash(password,config.bcrypt_salt_rounds as string);
  const {id}= data;
  const approvied = await prisma.user.update({
    where:{
      id
    },
    data:{
      isemailVerified:true,
      password:hashedpassword
    }
  });

  const user = await prisma.technician.findFirst({
    where:{
      id
    },
  })
  const templatePath = path.join(
      process.cwd(),
      "src/app/templates/technician-welcome-email"
    );
  
    const html = await ejs.renderFile(templatePath, {
    name: approvied.fullName,
    email: data.email,
    employeeId: user?.id,
    password: password,
    loginUrl: "http://localhost:5000/api/auth/login",
  });
  
    await transporter.sendMail({
      from: config.email_sender,
      to: data.email,
      subject: "Email Verification",
      html,
    });
}


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
