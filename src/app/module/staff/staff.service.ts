import path from "path";
import { Status, UserRole } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { Staff } from "./staff.interface";
import crypto from "crypto";
import { transporter } from "../../lib/nodemailer";
import config from "../../config";
import ejs from "ejs";
import { cloudinary } from "../../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

const getStaff = async () => {
  const result = await prisma.departmentMembership.findMany({
    include: {
      user: true,
      department: true,
    },
  });
  return result;
};

const staffApplay = async (payload: Staff,file:Buffer) => {
  const {
    fullName,
    email,
    password,
    role,
    departmentId,
    departmentRole,
    address
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
            },
          )
          .end(file.buffer);
      },
    );

  const result = await prisma.user.create({
    data: {
      fullName,
      email,
      password,
      role,
      isemailVerified: true,
      staff:{
        create:{
          departmentId,
          departmentRole,
          resumeId:resumeUpload.public_id,
          address
        }
      }
    },
  });
  const staffdata = await prisma.user.findUnique({
    where:{
      id:result.id
    },
    include:{
      staff:true
    }
  })
  console.log(staffdata);
  return result;
};

const conformStaff = async (payload: Staff, id: string) => {
  const { departmentRole,status } = payload;

  console.log(departmentRole)

  if(departmentRole==="DEPARTMENT_HEAD"){
    throw new Error("select defarent role");
  }
  
 
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status
    },
  });
  return result;
};
const conformManager = async (payload: Staff, id: string) => {
  const { departmentRole,address } = payload;
 
  const result = await prisma.departmentMembership.update({
    where: {
      id,
    },
    data: {
      departmentRole,
      address,
      status:Status.ACTIVE
    },
  });
  return result;
};

const deleteStaff = async (id: string) => {
  const result = await prisma.departmentMembership.delete({
    where: {
      id,
    },
  });
  return result;
};

export const StaffServices = {
  getStaff,
  staffApplay,
  conformStaff,
  conformManager,
  deleteStaff,
};
