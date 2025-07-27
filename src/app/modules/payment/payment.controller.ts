/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";


const initPayment = async (req: Request, res:Response, next: NextFunction) =>{
     const bookingId = req.params.bookingId;
     const result = await PaymentService.initPayment(bookingId);
     sendResponse(res,{
                 success: true,
                 statusCode: 201,
                 message: "Payment done successfully",
                 data: result
             })
} 

const paymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const result = await PaymentService.successPayment(query as Record<string, string>);

    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
  } catch (error) {
    next(error);
  }
};

const paymentFailed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const result = await PaymentService.failedPayment(query as Record<string, string>);

    res.redirect(`${envVars.SSL.SSL_FAILED_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
  } catch (error) {
    next(error);
  }
};

const paymentCancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const result = await PaymentService.cancelPayment(query as Record<string, string>);

    res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
  } catch (error) {
    next(error);
  }
};

export const PaymentController = {
  initPayment,
  paymentSuccess,
  paymentFailed,
  paymentCancel,
};