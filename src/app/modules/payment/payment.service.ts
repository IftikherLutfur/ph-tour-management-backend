/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking_Status } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslcommerz/sslcommerz.interface";
import { SSLService } from "../sslcommerz/sslcommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";


const initPayment = async (bookingId: string) =>{

    const payment = await Payment.findOne({booking: bookingId})
    if(!payment){
        throw new Error("Payment not found")
    }
    const booking = await Booking.findById(payment.booking)
    const userAddress = (booking?.user as any).address
            const userEmail = (booking?.user as any).email
            const userPhoneNumber = (booking?.user as any).phone
            const userName = (booking?.user as any).name
    
            const sslPayload: ISSLCommerz = {
                address: userAddress,
                email: userEmail,
                phoneNumber: userPhoneNumber,
                name: userName,
                amount: payment.amount,
                transaction: payment.transactionId
            }
    
            const sslPayment = await SSLService.sslPayment(sslPayload)
            return {
                 paymenturl: sslPayment.GatewayPageURL
            }
}



const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, session }
    );

    if (!updatedPayment) {
      throw new Error("Payment not found with provided transactionId");
    }

    await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: Booking_Status.COMPLETE },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment completed successfully",
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { session }
    );

    if (!updatedPayment) throw new Error("Payment not found with provided transactionId");

    await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: Booking_Status.CANCEL },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment cancelled",
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const failedPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { session }
    );

    if (!updatedPayment) throw new Error("Payment not found with provided transactionId");

    await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: Booking_Status.FALED },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

export const PaymentService = {
    initPayment,
  successPayment,
  cancelPayment,
  failedPayment,
};