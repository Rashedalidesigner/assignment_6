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
const approvedStaff = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params?.id;
    const {status} = req.body;
    const user = req.user;
    if(user?.role!=="CITY_ADMIN"&& user?.role!=="DEPARTMENT_MANAGER"){
      throw new Error("Admin staff only city admin and department manager");
    }
    const result = await StaffServices.ApproviedStaff(id as unknown as string,status);

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
    approvedStaff,
    deleteStaff
}