import { Router } from "express";
import { PaymentController } from "./payment.controller";

const payment = Router()

payment.post("/init-payment/:bookingId" ,PaymentController.initPayment)
payment.post("/success",PaymentController.paymentSuccess)
payment.post("/cancel", PaymentController.paymentCancel)
payment.post("/failed",PaymentController.paymentFailed)

export const paymentRoute = payment;