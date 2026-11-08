import { Router } from "express";
import { TechnicianController } from "./technician.controller";

const router = Router();


router.get("/",TechnicianController.getTechnician);
router.get("/:id",TechnicianController.getTechnicianById);
router.post("/",TechnicianController.applayTechnician);
router.patch("/:id",TechnicianController.approvedTechnician);
router.delete("/:id",TechnicianController.deleteTechnician);

export const TechnicianRoute = router;