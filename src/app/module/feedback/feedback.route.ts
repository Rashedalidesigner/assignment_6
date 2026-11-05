import { Router } from "express";
import { DepartmentController } from "../department/department.controller";

const router = Router();


router.get("/department",DepartmentController.getDepartment);
router.post("/department",DepartmentController.createDepartment);
router.patch("/department/:id",DepartmentController.updateDepartment);
router.delete("/department/:id",DepartmentController.deleteDepartment);


export const FeedbackRouter = router;