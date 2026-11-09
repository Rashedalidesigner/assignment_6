import { Router } from "express";
import { ComplaintController } from "./complaint.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get("/", ComplaintController.getComplaint);
router.post("/",auth("CITIZEN"), ComplaintController.createComplaint);
router.patch("/:id", ComplaintController.updateComplaint);
router.delete("/:id", ComplaintController.deleteComplaint);

export const ComplaintRouter = router;