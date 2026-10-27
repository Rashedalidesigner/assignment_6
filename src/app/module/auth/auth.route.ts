import { Router } from "express";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidation.PatientRegistrationZodSchema),
  AuthController.registerPatient,
);
router.post(
  "/verify-email",
  validateRequest(UserValidation.PatientEmailVerifyZodSchema),
  AuthController.verifyPatientEmail,
);
router.post(
  "/login",
  validateRequest(UserValidation.LoginZodSchema),
  AuthController.loginUser,
);
router.get(
  "/me",
  auth(UserRole.CITIZEN,UserRole.CITY_ADMIN,UserRole.DEPARTMENT_MANAGER,UserRole.DEPARTMENT_STAFF,UserRole.TECHNICIAN),
  // validateRequest
  AuthController.getMe,
);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/google", AuthController.googleLogin);
router.post(
  "/forgot-password",
  validateRequest(UserValidation.ForgotPasswordZodSchema),
  AuthController.forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest(UserValidation.ResetPasswordZodSchema),
  AuthController.resetPassword,
);
router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
