import { Router } from "express";
import { StaffController } from "./staff.controller";

const router = Router();


router.get("/staff", StaffController.getStaff);
router.post("/staff", StaffController.createStaff);
router.patch("/staff/:id", StaffController.updateStaff);
router.delete("/staff/:id", StaffController.deleteStaff);


export const StaffRouter = router;