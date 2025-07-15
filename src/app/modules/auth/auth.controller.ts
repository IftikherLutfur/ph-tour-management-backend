import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async(req:Request, res: Response)=>{
    // const user = await userServices()

    const logInfo = await AuthServices.credentialsLogin(req.body);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message:"UserLoged Successfully",
        data: logInfo
    })
})

export const authControllers = {
    credentialsLogin
}