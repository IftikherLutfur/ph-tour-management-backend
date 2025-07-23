import { Router } from "express";
import { TourTypeController } from "./tour.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { tourValidation } from "./tour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/create",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(tourValidation), TourTypeController.createTour)
router.get("/", TourTypeController.getTours)
router.get("/:id", TourTypeController.getSingleTour)
router.patch("/:id", TourTypeController.updateTour)
router.delete("/:id", TourTypeController.deleteTour)

// ---------------------Tour Type--------------------
router.post("/create-tour-type", TourTypeController.createTourTypes)
router.get("/tour-types", TourTypeController.tourTypeFind)
router.patch("/tour-types/:id", TourTypeController.tourTypeUpdated)
router.delete("/tour-types/:id", TourTypeController.tourTypeDelete)

export const tourRoute = router;