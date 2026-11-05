import { Router } from "express";
import { CategoryController } from "./category.controller";

const router = Router();


router.get("/category",CategoryController.GetCategory);
router.post("/category",CategoryController.PostCategory);
router.patch("/category/:id",CategoryController.updateCategory);
router.delete("/category/:id",CategoryController.deleteCategory);
