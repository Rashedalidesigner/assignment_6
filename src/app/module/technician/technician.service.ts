import { prisma } from "../../lib/prisma"
import { ITechnician } from "./technician.interface";

const getTechnician = async ()=>{
    const technician = await prisma.technician.findMany();
    return technician;
}

const getTechnicianById = async (id: string)=>{
    const technician = await prisma.technician.findUnique({
        where: {
            id
        }
    });
    return technician;
}

const createTechnician = async (data: ITechnician)=>{
    const {id, userId, experienceYears, specialization} = data;
    const technician = await prisma.technician.create({
        data:{
            id,
            userId,
            experienceYears,
            specialization,
        }
    });
    return technician;
}

const updateTechnician = async (id: string, data: Partial<ITechnician>)=>{
    const technician = await prisma.technician.update({
        where: {
            id
        },
        data
    });
    return technician;
}


const deleteTechnician = async (id: string)=>{
    const technician = await prisma.technician.delete({
        where: {
            id
        }
    });
    return technician;
}

export const TechnicianService = {
    getTechnician,
    getTechnicianById,
    createTechnician,
    updateTechnician,
    deleteTechnician
}
