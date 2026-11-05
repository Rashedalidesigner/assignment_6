import { Router } from "express";
import { TechnicianController } from "./technician.controller";

const router = Router();


router.get("/",TechnicianController.getTechnician);
router.get("/:id",TechnicianController.getTechnicianById);
router.post("/",TechnicianController.createTechnician);
router.put("/:id",TechnicianController.updateTechnician);
router.delete("/:id",TechnicianController.deleteTechnician);

export const TechnicianRoute = router;