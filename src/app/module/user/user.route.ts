import { Router } from "express";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
import { UserController } from "./user.controller";

const router = Router();

router.patch(
	"/profile-image",
	auth(UserRole.CITY_ADMIN, UserRole.DEPARTMENT_MANAGER, UserRole.DEPARTMENT_STAFF, UserRole.CITIZEN,UserRole.TECHNICIAN),
	upload.single("profileImage"),
	UserController.uploadProfileImage,
);

export const UserRoutes = router;
