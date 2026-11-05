import { prisma } from "../../lib/prisma";
import { Department } from "./department.interface";

const getDepartment = async ()=>{
    const result = await prisma.department.findMany();
    return result;
}

const createDepartment = async (payload:Department)=>{
    const {name,description,code,email,phone} = payload;
    const result = await prisma.department.create({
        data:{
            name,
            description,
            code,
            email,
            phone
        }
    });
    return result;
}

const updateDepartment = async (payload:Department,id:string)=>{
    const {name,description,code,email,phone} = payload;
    const result = await prisma.department.update({
        where:{
            id
        },
        data:{
            name,
            description,
            code,
            email,
            phone
        }
    });
    return result;
}

const deleteDepartment = async (id:string)=>{
    const result = await prisma.department.delete({
        where:{
            id
        }
    });
    return result;
}

export const DepartmentServices = {
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
}