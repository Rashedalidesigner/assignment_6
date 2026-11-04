import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { Attachment } from "./attachment.interface";

const getAttachment = async ()=>{
    const result = await prisma.attachment.findMany();
    return result;
}

const createAttachment = async (payload:Attachment,buffer:Buffer,userId:string)=>{
    const {complaintId} = payload;
    const cloudinaryresult = await cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
            },
            async (error, result) => {
                if (error) {
                    throw new Error(`Cloudinary upload failed: ${error.message}`);
                } 

                await prisma.attachment.create({
                    data:{
                        complaintId,
                        uploadedById: userId,
                        type: "IMAGE",
                        filePublicId: result?.public_id || "",
                        fileUrl: result?.secure_url ,
                        fileSize: result?.bytes 
                    }
                })

            }
        ).end(buffer);
    return cloudinaryresult;
}