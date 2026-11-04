import { prisma } from "../../lib/prisma";
import { Staff } from "./staff.interface";

const getStaff = async () => {
  const result = await prisma.departmentMembership.findMany({
    include: {
      user: true,
      department: true,
    },
  });
  return result;
};


const createStaff = async (payload: Staff) => {
  const { userId, departmentId, departmentRole } = payload;
  const result = await prisma.departmentMembership.create({
    data: {
      userId,
      departmentId, 
        departmentRole,
    },
  });
  return result;
}

const updateStaff = async (payload: Staff, id: string) => {
  const { departmentRole } = payload;
  const result = await prisma.departmentMembership.update({
    where: {
      id,
    },
    data: {
      departmentRole,
    },
  });
  return result;
}

const deleteStaff = async (id: string) => {
  const result = await prisma.departmentMembership.delete({
    where: {
        id,
    },
  });
  return result;
}

export const StaffServices = {
  getStaff,
  createStaff,
    updateStaff,
    deleteStaff,
};
