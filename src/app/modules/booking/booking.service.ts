/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransaction";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslcommerz/sslcommerz.interface";
import { SSLService } from "../sslcommerz/sslcommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
// import { User } from "../user/user.model";
import { Booking_Status, IBooking } from "./booking.interface";
import { Booking } from "./booking.model"
import httpStatus from "http-status-codes"


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId()
    const session = await Booking.startSession();
    session.startTransaction()


    try {
        const user = await User.findById(userId)
        if (!user?.address || !user.phone) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile( specially phone & address) to book a tour")
        }


        const tour = await Tour.findById(payload.tour).select("costForm")
        if (!tour?.costForm) {
            throw new AppError(httpStatus.NOT_FOUND, "No costForm found")
        }

        if (typeof payload.guestCount !== "number") {
            throw new AppError(httpStatus.BAD_REQUEST, "Guest count is required to book a tour");
        }

        const amount = Number(tour.costForm) * Number(payload.guestCount)

        const booking = await Booking.create([{
            user: userId,
            ...payload,
            status: Booking_Status.PENDING,
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session })

        const updateBooking =
            await Booking.findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, session } // ✅ Correct
            )
                .populate("user", "name email phone address")
                .populate("tour", "title costForm")
                .populate("payment")

        const userAddress = (updateBooking?.user as any).address
        const userEmail = (updateBooking?.user as any).email
        const userPhoneNumber = (updateBooking?.user as any).phone
        const userName = (updateBooking?.user as any).name

        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transaction: transactionId
        }

        const sslPayment = await SSLService.sslPayment(sslPayload)

        await session.commitTransaction();
        session.endSession()
        return {
            paymenturl: sslPayment.GatewayPageURL, 
            booking: updateBooking
        };

    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        console.log(error)
    }


}

const bookingGet = async () => {
    const booking = await Booking.find()
    return booking;
}

const getUserBooking = async () => {
    const booking = await Booking.findOne()
    return booking;
}

const singleBookingGet = async () => {
    const booking = await Booking.findById({})
    return booking;
}

const bookingUpdate = async () => {
    const booking = await Booking.findByIdAndUpdate()
    return booking;
}

const bookingDelete = async () => {
    const booking = await Booking.findByIdAndDelete()
    return booking;
}

export const BookingServices = {
    createBooking,
    bookingGet,
    getUserBooking,
    singleBookingGet,
    bookingUpdate,
    bookingDelete
}