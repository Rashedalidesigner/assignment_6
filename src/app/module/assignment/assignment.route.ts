import { Router } from "express";
import { AssignmentController } from "./assignment.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get("/",AssignmentController.getAllAssignment);

router.post("/",auth("CITY_ADMIN","DEPARTMENT_MANAGER","DEPARTMENT_STAFF"),AssignmentController.createAssignmet);

router.patch("/:id",auth("CITY_ADMIN","DEPARTMENT_MANAGER","DEPARTMENT_STAFF","TECHNICIAN"),AssignmentController.updateAssignment);

router.delete("/:id",auth("CITY_ADMIN","DEPARTMENT_MANAGER","DEPARTMENT_STAFF"),AssignmentController.deleteAssignment);

export const AsiignementRouter = router;