import { prisma } from "../../lib/prisma";
import { Category } from "./categore.interface"

const GetCategory = async()=>{
    const result = await prisma.category.findMany();
    return result;
}

const PostCategory = async(payload:Category)=>{
    const {departmentId,description,name} = payload;
    const result = await prisma.category.create({
        data:{
            departmentId,
            name,
            description
        }
    });
    
    return result
}

const updateCategory = async (payload:Category,id:string)=>{
    const {description,name} = payload;
    
    const result = await prisma.category.update({
        where:{
            id
        },
        data:{
            name,
            description
        }
    });
    return result;
}

const deleteCategory = async (id:string)=>{
 const result = await prisma.category.delete({
    where:{
        id
    }
 });
 return result;
}

export const CategoryServices = {
    GetCategory,PostCategory,updateCategory,deleteCategory
}