import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TechnicianService } from "./technician.service";

const getTechnician= catchAsync(async(req:Request,res:Response)=>{
    const technician = await TechnicianService.getTechnician();
    res.status(200).json({
        success:true,
        message:"Technician Fetched Successfully",
        data:technician
    })
});

const getTechnicianById= catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const technician = await TechnicianService.getTechnicianById(id as unknown as string);
    res.status(200).json({
        success:true,
        message:"Technician Fetched Successfully",
        data:technician
    })
});

const createTechnician= catchAsync(async(req:Request,res:Response)=>{
    const data = req.body;
    const technician = await TechnicianService.createTechnician(data);
    res.status(201).json({
        success:true,
        message:"Technician Created Successfully",
        data:technician
    })
});

const updateTechnician= catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const data = req.body;
    const technician = await TechnicianService.updateTechnician(id as unknown as string,data);
    res.status(200).json({
        success:true,
        message:"Technician Updated Successfully",
        data:technician
    })
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
    createTechnician,
    updateTechnician,
    deleteTechnician
}