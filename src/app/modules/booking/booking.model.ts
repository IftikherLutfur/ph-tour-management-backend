import { Booking_Status, IBooking } from "./booking.interface";
import { model, Schema } from "mongoose";

const bookingSchema = new Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: "Payment"
    },
    status: {
        type: String,
        enum: Object.values(Booking_Status),
        default: Booking_Status.PENDING
    },
    guestCount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

export const Booking = model<IBooking>("Booking", bookingSchema)