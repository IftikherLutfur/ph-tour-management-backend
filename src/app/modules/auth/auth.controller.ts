import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setAuthCookie";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    // const user = await userServices()

    const logInfo = await AuthServices.credentialsLogin(req.body);

    // res.cookie("accessToken", logInfo.accessToken,{
    //     httpOnly: true,
    //     secure: false
    // })

    // res.cookie("refreshToken", logInfo.refreshToken,{
    //     httpOnly: true,
    //     secure: false,
    // })

    // cookie setup er kaj setAuthCookie korbe, 
    setAuthCookie(res, logInfo)// setAuthCookie te res r login info pathiye diyechi


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "UserLoged Successfully",
        data: logInfo
    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    // const user = await userServices()
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, "Not refresh token recieved from the cookies")
    }
    const tokeInfo = await AuthServices.getNewToken(refreshToken as string);
    setAuthCookie(res, tokeInfo)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "UserLoged Successfully",
        data: tokeInfo
    })
})


export const authControllers = {
    credentialsLogin,
    getNewAccessToken
}