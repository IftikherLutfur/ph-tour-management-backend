import { Router } from "express";
import { TourTypeController } from "./tour.controller";

const router = Router()

router.post("/create", TourTypeController.createTour)
router.get("/", TourTypeController.getTours)
router.get("/:id", TourTypeController.getSingleTour)
router.patch("/:id", TourTypeController.updateTour)

// ---------------------Tour Type--------------------
router.post("/create-tour-type", TourTypeController.createTourTypes)
router.get("/tour-types", TourTypeController.tourTypeFind)
router.patch("/tour-types/:id", TourTypeController.tourTypeUpdated)
router.delete("/tour-types/:id", TourTypeController.tourTypeDelete)

export const tourRoute = router;