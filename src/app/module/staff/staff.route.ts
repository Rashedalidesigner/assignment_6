import { Router } from "express";
import { StaffController } from "./staff.controller";
import { upload } from "../../lib/multer";

const router = Router();


router.get("/staff", StaffController.getStaff);
router.post("/staff", upload.single("image"), StaffController.createStaff);
router.patch("/staff/:id", upload.single("image"), StaffController.updateStaff);
router.delete("/staff/:id", StaffController.deleteStaff);


export const StaffRouter = router;