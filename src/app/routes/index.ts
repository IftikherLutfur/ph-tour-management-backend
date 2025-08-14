import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { divisionRoute } from "../modules/division/division.route";
import { tourRoute } from "../modules/tour/tour.route";
import {bookingRoute} from "../modules/booking/booking.route";
import { paymentRoute } from "../modules/payment/payment.route";
import { OTPRoutes } from "../modules/otp/otp.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/division",
        route: divisionRoute
    },
    {
        path: "/tour",
        route: tourRoute
    },
    {
        path: "/booking",
        route: bookingRoute
    },
    {
        path:"/payment",
        route: paymentRoute
    },
    {
        path: "/OTP",
        route: OTPRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})