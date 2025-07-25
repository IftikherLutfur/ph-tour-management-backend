import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const book = Router()

book.post("/", checkAuth(...Object.values(Role)), validateRequest(createBookingZodSchema), BookingController.createBooking)

export const bookingRoute = book;