import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createAttachment = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    const payload = req.body;
    
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Attachment created successfully",
        data: ""
    })
})