import { Router } from "express";
import { DepartmentController } from "../department/department.controller";

const router = Router();


router.get("/",DepartmentController.getDepartment);
router.post("/",DepartmentController.createDepartment);
router.patch("/:id",DepartmentController.updateDepartment);
router.delete("/:id",DepartmentController.deleteDepartment);


export const FeedbackRouter = router;