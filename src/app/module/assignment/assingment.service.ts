import { AssignmentStatus } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IAssignment } from "./assignment.interface";



const getAllAssignment = async()=>{
    const assignment = await prisma.assignment.findMany();
    return assignment
}

const createAssignment = async (payload:IAssignment)=>{
    console.log(payload);
    const {technicianId,compaintId,workStatus}= payload
    const assignmet = await prisma.assignment.create({
        data:{
            technicianId,
            compaintId,
            workStatus
        }
    });
    return assignmet
}

const updateAssignment = async(id:string,technicianId:string,workStatus:AssignmentStatus)=>{
    const updateAssignment = await prisma.assignment.update({
        where:{
            id
        },
        data:{
            technicianId,
            workStatus
        }
    });
    return updateAssignment
};

const deleteAssignment = async (id:string)=>{
    const assignment = await prisma.assignment.delete({
        where:{
            id
        }
    });
    return assignment
}

export const assignmentService = {
    getAllAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}