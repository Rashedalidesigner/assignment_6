import { Router } from "express";
import { TechnicianController } from "./technician.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();


router.get("/",TechnicianController.getTechnician);
router.get("/:id",TechnicianController.getTechnicianById);
router.post("/applay-technician",TechnicianController.applayTechnician);
router.patch("/approvied-technician/:id",auth("CITY_ADMIN","DEPARTMENT_MANAGER"),TechnicianController.approvedTechnician);
router.delete("/:id",TechnicianController.deleteTechnician);

export const TechnicianRoute = router;