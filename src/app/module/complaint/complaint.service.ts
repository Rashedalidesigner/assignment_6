import { prisma } from "../../lib/prisma";
import { Complaint, ComplaintUser } from "./complaint.interface";

const getComplaint = async ()=>{
    const result = await prisma.complaint.findMany();
    return result;
};

const createComplaint = async (id:string,payload:Complaint)=>{
    const {title,description,categoryId,locationId,departmentId} = payload;
    const result = await prisma.complaint.create({
        data:{
            title,
            description,
            locationId,
            citizenId:id,
            categoryId,
            departmentId
        }
    });
    return result;
};

const updateComplaint = async (payload:Complaint,id:string)=>{
    const {title,description,status,priority} = payload;
    const result = await prisma.complaint.update({
        where:{
            id
        },
        data:{
            title,
            description,
            status,
            priority: priority as any
        }
    });
    return result;
};

const deleteComplaint = async (id:string)=>{
    const result = await prisma.complaint.delete({
        where:{
            id
        }
    });
    return result;
};

export const ComplaintServices = {
    getComplaint,
    createComplaint,
    updateComplaint,
    deleteComplaint
}