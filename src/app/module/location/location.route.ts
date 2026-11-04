import { Router } from "express";
import { LocationController } from "./location.controller";

const router = Router();

router.get("/", LocationController.getLocation);
router.post("/", LocationController.createLocation);
router.put("/:id", LocationController.updateLocation);
router.delete("/:id", LocationController.deleteLocation);


export default router;