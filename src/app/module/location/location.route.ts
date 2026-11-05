import { Router } from "express";
import { LocationController } from "./location.controller";

const router = Router();


router.get("/:id",LocationController.getLocationById);
router.get("/", LocationController.getLocation);
router.post("/", LocationController.createLocation);
router.patch("/:id", LocationController.updateLocation);
router.delete("/:id", LocationController.deleteLocation);


export const LocationRouter = router;