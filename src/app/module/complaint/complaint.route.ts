import { Router } from "express";
import { ComplaintController } from "./complaint.controller";

const router = Router();

router.get("/complaint", ComplaintController.getComplaint);
router.post("/complaint", ComplaintController.createComplaint);
router.patch("/complaint/:id", ComplaintController.updateComplaint);
router.delete("/complaint/:id", ComplaintController.deleteComplaint);

export const ComplaintRouter = router;