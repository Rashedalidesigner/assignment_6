import { Router } from "express";
import { TechnicianController } from "./technician.controller";

const router = Router();


router.get("/technicians",TechnicianController.getTechnician);
router.get("/technicians/:id",TechnicianController.getTechnicianById);
router.post("/technicians",TechnicianController.createTechnician);
router.put("/technicians/:id",TechnicianController.updateTechnician);
router.delete("/technicians/:id",TechnicianController.deleteTechnician);

export const TechnicianRoute = router;