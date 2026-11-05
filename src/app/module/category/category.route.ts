import { Router } from "express";
import { CategoryController } from "./category.controller";

const router = Router();


router.get("/",CategoryController.GetCategory);
router.post("/",CategoryController.PostCategory);
router.patch("/:id",CategoryController.updateCategory);
router.delete("/:id",CategoryController.deleteCategory);


export const categoryRouter = router;