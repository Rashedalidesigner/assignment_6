import { Router } from "express";
import { StaffController } from "./staff.controller";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";

const router = Router();


router.get("/",auth("CITY_ADMIN","DEPARTMENT_MANAGER"), StaffController.getStaff);
router.post("/apply-staff", upload.single("resume"), StaffController.applyStaff);
router.patch("/aproved-staff/:id", auth("DEPARTMENT_MANAGER","CITY_ADMIN"), StaffController.approvedStaff);
router.delete("/:id",auth("CITY_ADMIN","DEPARTMENT_MANAGER"), StaffController.deleteStaff);


export const StaffRouter = router;