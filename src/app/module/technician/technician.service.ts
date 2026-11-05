import bcrypt from "bcryptjs";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ITechnician } from "./technician.interface";
import config from "../../config";

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

const createTechnician = async (data: ITechnician) => {
  const { fullname, email, phone, password } = data;
  const hashedpassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
  const technician = await prisma.user.create({
    data: {
      fullName: fullname,
      email,
      password: hashedpassword,
      role: UserRole.TECHNICIAN,
      isemailVerified: true,
      phone:phone,
      technician: {
        create: {
          experienceYears: 2,
          specialization: ["computer"],
        },
      },
    },
  });
  return technician;
};

const updateTechnician = async (id: string, data: Partial<ITechnician>) => {
  const technician = await prisma.technician.update({
    where: {
      id,
    },
    data,
  });
  return technician;
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
  createTechnician,
  updateTechnician,
  deleteTechnician,
};
