import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { attachmentService } from "./attachment.service";

const createAttachment = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    const payload = req.body;
    const userId = req.user?.userId;

    const result = await attachmentService.createAttachment(payload, file?.buffer as Buffer, userId as string);
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Attachment created successfully",
        data: ""
    })
})

export const attachmentController = {
    createAttachment
}