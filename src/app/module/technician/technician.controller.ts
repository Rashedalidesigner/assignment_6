import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TechnicianServices } from "./technician.service";



const getTechnician = catchAsync(async (req:Request,res:Response)=>{
    const result = await TechnicianServices.getTechnician();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician retrieved successfully",
    data: result,
  });
})
const createTechnician = catchAsync(async (req:Request,res:Response)=>{
    const result = await TechnicianServices.createTechnician(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician created successfully",
    data: result,
  });
})
const updateTechnician = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await TechnicianServices.updateTechnician(req.body, id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician updated successfully",
    data: result,
  });
})
const deleteTechnician = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await TechnicianServices.deleteTechnician(id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician deleted successfully",
    data: result,
  });
})


export const TechnicianController = {
    getTechnician,
    createTechnician,
    updateTechnician,
    deleteTechnician
}