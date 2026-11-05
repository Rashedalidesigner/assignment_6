import { Router } from "express";
import { StaffController } from "./staff.controller";
import { upload } from "../../lib/multer";

const router = Router();


router.get("/", StaffController.getStaff);
router.post("/", upload.single("image"), StaffController.createStaff);
router.patch("/:id", upload.single("image"), StaffController.updateStaff);
router.delete("/:id", StaffController.deleteStaff);


export const StaffRouter = router;