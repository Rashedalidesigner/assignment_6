import { Router } from "express";
import { StaffController } from "./staff.controller";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";

const router = Router();


router.get("/", StaffController.getStaff);
router.post("/", upload.single("resume"), StaffController.applyStaff);
router.patch("/staffConform/:id", auth("DEPARTMENT_MANAGER","CITY_ADMIN"), StaffController.updateStaff);
router.patch("/managerConform/:id", auth("CITY_ADMIN"), StaffController.updateManager);
router.patch("/verify-staff" ,StaffController.verifyStaff);
router.delete("/:id", StaffController.deleteStaff);


export const StaffRouter = router;