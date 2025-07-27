/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookingServices } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

// create Bookin
const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    console.log(decodedToken)
    const booking = await BookingServices.createBooking(req.body, decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Booking added successfully",
        data: booking

    })
}) 


// Get all booking
const getBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingServices.bookingGet()
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Retrieved all the booking",
        data: booking

    })
}) 


const getUserBookings =catchAsync(async(req:Request, res:Response)=>{
    const bookngs = await BookingServices.getUserBooking()
}) 

// Get single booking
const getSingleBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingServices.singleBookingGet()
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Retrieved the single booking data",
        data: booking

    })
}) 


// Update booking
const updateBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingServices.bookingUpdate()
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Booking updated successfully",
        data: booking

    })
}) 


//Delete booking
const deleteBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingServices.bookingDelete()
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Booking deleted succesfully",
        data: null

    })
}) 

export const BookingController = {
    createBooking,
    getBooking,
    getUserBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking
}