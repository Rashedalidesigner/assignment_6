import { prisma } from "../../lib/prisma";

const getFeedback = async ()=>{
    const result = await prisma.feedback.findMany();
    return result;
}

const createFeedback = async (payload:any)=>{
    const {complaintId,authorId,rating,comment} = payload;
    const result = await prisma.feedback.create({
        data:{
            complaintId,
            authorId,
            rating,
            comment
        }
    });
    return result;
}

const updateFeedback = async (payload:any,id:string)=>{
    const {rating,comment} = payload;
    const result = await prisma.feedback.update({
        where:{
            id
        },
        data:{
            rating,
            comment
        }
    });
    return result;
}

const deleteFeedback = async (id:string)=>{
    const result = await prisma.feedback.delete({
        where:{
            id
        }
    });
    return result;
}


export const FeedbackServices = {
    getFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback
}