import { Router } from "express";
import { TechnicianController } from "./technician.controller";

const router = Router();


router.get("/technician", TechnicianController.getTechnician);
router.post("/technician", TechnicianController.createTechnician);
router.patch("/technician/:id", TechnicianController.updateTechnician);
router.delete("/technician/:id", TechnicianController.deleteTechnician);

export const TechnicianRouter = router;