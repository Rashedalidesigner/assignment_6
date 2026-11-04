import { Router } from "express";
import { DepartmentController } from "./department.controller";

const router = Router();


router.get("/department",DepartmentController.getDepartment);
router.post("/department",DepartmentController.createDepartment);
router.patch("/department",DepartmentController.updateDepartment);
router.delete("/department",DepartmentController.deleteDepartment);

export const DepartmentRouter = router;