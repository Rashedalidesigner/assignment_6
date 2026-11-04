import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { LocationServices } from "./location.service";


const getLocation = catchAsync(async (req:Request,res:Response)=>{
    const result = await LocationServices.getLocation();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location retrieved successfully",
    data: result,
  });
})
const createLocation = catchAsync(async (req:Request,res:Response)=>{
    const result = await LocationServices.createLocation(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location created successfully",
    data: result,
  });
})
const updateLocation = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await LocationServices.updateLocation(req.body, id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location updated successfully",
    data: result,
  });
})
const deleteLocation = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await LocationServices.deleteLocation(id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location deleted successfully",
    data: result,
  });
})


export const LocationController = {
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation
}