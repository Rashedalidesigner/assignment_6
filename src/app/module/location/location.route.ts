import { Router } from "express";
import { LocationController } from "./location.controller";

const router = Router();

router.get("/location", LocationController.getLocation);
router.post("/location", LocationController.createLocation);
router.put("/location/:id", LocationController.updateLocation);
router.delete("/location/:id", LocationController.deleteLocation);


export default router;