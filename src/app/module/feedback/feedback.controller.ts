import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { FeedbackServices } from "./feedback.service";


const getFeedback = catchAsync(async (req:Request,res:Response)=>{
    const result = await FeedbackServices.getFeedback();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback retrieved successfully",
    data: result,
  });
})
const createFeedback = catchAsync(async (req:Request,res:Response)=>{
    const result = await FeedbackServices.createFeedback(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback created successfully",
    data: result,
  });
})
const updateFeedback = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await FeedbackServices.updateFeedback(req.body, id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback updated successfully",
    data: result,
  });
})
const deleteFeedback = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params;
    const result = await FeedbackServices.deleteFeedback(id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback deleted successfully",
    data: result,
  });
})


export const FeedbackController = {
    getFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback
}