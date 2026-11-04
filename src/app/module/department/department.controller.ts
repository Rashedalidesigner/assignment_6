import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { DepartmentServices } from "./department.service";


const getDepartment = catchAsync(async (req:Request,res:Response)=>{
    const result = await DepartmentServices.getDepartment();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department retrieved successfully",
    data: result,
  });
})
const createDepartment = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await DepartmentServices.createDepartment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department created successfully",
    data: result,
  });
})
const updateDepartment = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await DepartmentServices.updateDepartment(req.body, id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department updated successfully",
    data: result,
  });
})
const deleteDepartment = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await DepartmentServices.deleteDepartment(id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department deleted successfully",
    data: result,
  });
})


export const DepartmentController = {
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
}