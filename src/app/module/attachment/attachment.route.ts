import { Router } from "express";
import { attachmentController } from "./attachment.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post("/", auth("CITIZEN"), attachmentController.createAttachment);

export const AddAttchment = router;