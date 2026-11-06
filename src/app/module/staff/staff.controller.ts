import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { StaffServices } from "./staff.service";



const getStaff = catchAsync(async (req:Request,res:Response)=>{
    const result = await StaffServices.getStaff();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff retrieved successfully",
    data: result,
  });
})
const applyStaff = catchAsync(async (req:Request,res:Response)=>{
  const payload = req.body;
  const resume = req.file;
    const result = await StaffServices.staffApplay(payload,resume as unknown as Buffer);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff created successfully",
    data: result,
  });
})
const updateStaff = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params?.id;
    const result = await StaffServices.conformStaff(req.body, id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff updated successfully",
    data: result,
  });
})
const updateManager = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params?.id;
    const result = await StaffServices.conformManager(req.body, id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff updated successfully",
    data: result,
  });
})
const deleteStaff = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params?.id;
    const result = await StaffServices.deleteStaff(id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff deleted successfully",
    data: result,
  });
})


export const StaffController = {
    getStaff,
    applyStaff,
    updateStaff,
    updateManager,
    deleteStaff
}