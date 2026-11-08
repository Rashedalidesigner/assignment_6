import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CategoryServices } from "./category.service";
import { Category } from "./categore.interface";
import { error } from "node:console";
import { unknown } from "zod";

const GetCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.GetCategory();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Category retrive successfull",
    data: result,
  });
});

const PostCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body

  const result = await CategoryServices.PostCategory(payload);
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"Category Created successfull",
    data:result
  });
});

const updateCategory = catchAsync(async (req:Request,res:Response)=>{
    const payload = req.body;
    const id = req.params?.id;
    const result = await CategoryServices.updateCategory(payload,id as unknown as string );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category Updated successfull",
    data: result,
  });
})

const deleteCategory = catchAsync(async (req:Request,res:Response)=>{
    const id = req.params?.id;
    const result = await CategoryServices.deleteCategory(id as unknown as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfull",
    data: result,
  });
})

export const CategoryController = {
  GetCategory,
  PostCategory,
  updateCategory,
  deleteCategory,
};
