import { prisma } from "../../lib/prisma";

const getDepartment = async ()=>{
    const result = await prisma.department.findMany();
    return result;
}

const createDepartment = async (payload:any)=>{
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

const updateDepartment = async (payload:any,id:string)=>{
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