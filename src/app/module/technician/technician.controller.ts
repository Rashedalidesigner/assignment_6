import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TechnicianService } from "./technician.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getTechnician= catchAsync(async(req:Request,res:Response)=>{
    const technician = await TechnicianService.getTechnician();
     sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "retrived all technician successfull",
    data: technician,
  });
});

const getTechnicianById= catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const technician = await TechnicianService.getTechnicianById(id as unknown as string);
     sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "retrive technician successfull",
        data: technician,
      });
});

const applayTechnician = catchAsync(async (req:Request,res:Response)=>{
    const payload = req.body
    const result = await TechnicianService.applayTechnician(payload);
     sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applay Successfull",
    data: result,
  });
}
);

const approvedTechnician = catchAsync(async (req:Request,res:Response)=>{
    const user = req.user;
    const id = req.params?.id as unknown as string;
    const {email}= req.body;
    if(user?.role=="CITY_ADMIN"|| user?.role=="DEPARTMENT_MANAGER"){
throw new Error("Your are not Approvied");
    };

    const result = await TechnicianService.approviedTechnician({
        id,email
    });
sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician Approvied",
    data: result,
  });
    
});

const deleteTechnician= catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const technician = await TechnicianService.deleteTechnician(id as unknown as string);
    res.status(200).json({
        success:true,
        message:"Technician Deleted Successfully",
        data:technician
    })
});

export const TechnicianController = {
    getTechnician,
    getTechnicianById,
    applayTechnician,
    approvedTechnician,
    deleteTechnician
}