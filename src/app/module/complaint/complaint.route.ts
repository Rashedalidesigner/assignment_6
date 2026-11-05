import { Router } from "express";
import { ComplaintController } from "./complaint.controller";

const router = Router();

router.get("/", ComplaintController.getComplaint);
router.post("/", ComplaintController.createComplaint);
router.patch("/:id", ComplaintController.updateComplaint);
router.delete("/:id", ComplaintController.deleteComplaint);

export const ComplaintRouter = router;