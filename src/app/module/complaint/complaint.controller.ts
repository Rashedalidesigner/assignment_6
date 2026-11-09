import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ComplaintServices } from "./complaint.service";

const getComplaint = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await ComplaintServices.getComplaint();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Complaint retrieved successfully",
    data: result,
  });
})
const createComplaint = catchAsync(async (req:Request,res:Response)=>{
    const id = req.user?.userId;
    const payload = req.body;
    const result = await ComplaintServices.createComplaint(id as unknown as string,payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Complaint created successfully",
    data: result,
  });
})
const updateComplaint = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await ComplaintServices.updateComplaint(req.body, id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Complaint updated successfully",
    data: result,
  });
})
const deleteComplaint = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await ComplaintServices.deleteComplaint(id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Complaint deleted successfully",
    data: result,
  });
})


export const ComplaintController = {
    getComplaint,
    createComplaint,
    updateComplaint,
    deleteComplaint
}