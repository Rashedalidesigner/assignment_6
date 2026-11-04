import { prisma } from "../../lib/prisma";

const getTechnician = async ()=>{
    const result = await prisma.technician.findMany();
    return result;
}

const createTechnician = async (payload:any)=>{
    const {userId,profileId,experience,workexperienceName} = payload;
    const result = await prisma.technician.create({
        data:{
            userId,
            profileId,
            experience,
            workexperienceName
        }
    });
    return result;
}

const updateTechnician = async (payload:any,id:string)=>{
    const {profileId,experience,workexperienceName} = payload;
    const result = await prisma.technician.update({
        where:{
            id
        },
        data:{
            profileId,
            experience,
            workexperienceName
        }
    });
    return result;
}

const deleteTechnician = async (id:string)=>{
    const result = await prisma.technician.delete({
        where:{
            id
        }
    });
    return result;
}

export const TechnicianServices = {
    getTechnician,
    createTechnician,
    updateTechnician,
    deleteTechnician
}