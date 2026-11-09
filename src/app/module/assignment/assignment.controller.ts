import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { assignmentService } from "./assingment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllAssignment = catchAsync(async (req:Request,res:Response)=>{
    const result = await assignmentService.getAllAssignment();
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Get all Assignment Successfull",
        data:result
    })
})
const createAssignmet = catchAsync(async (req:Request,res:Response)=>{
    const user = req.user;
    if(user?.role!=="CITIZEN" && user?.role=="TECHNICIAN"){
        throw new Error("your are not create assignment");
    }
    const result = await assignmentService.createAssignment(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Get all Assignment Successfull",
        data:result
    })
})
const updateAssignment = catchAsync(async (req:Request,res:Response)=>{
    const user = req.user;
    const id = req.params?.id;
    const { technicianId,workStatus} = req.body;
    if(user?.role!=="CITIZEN" ){
        throw new Error("your are not create assignment");
    }
    const result = await assignmentService.updateAssignment(id as unknown as string,technicianId,workStatus);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Get all Assignment Successfull",
        data:result
    })
})
const deleteAssignment = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params?.id;
    const result = await assignmentService.deleteAssignment(id as unknown as string);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Get all Assignment Successfull",
        data:result
    });
});


export const AssignmentController = {
    getAllAssignment,
    createAssignmet,
    updateAssignment,
    deleteAssignment
}