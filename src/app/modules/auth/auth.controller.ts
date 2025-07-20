/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { createUserToken } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const user = await userServices()

    // const logInfo = await AuthServices.credentialsLogin(req.body);

    passport.authenticate("local", async (err: any, user: any, info: any) => {
        console.log(user, "Controller")
        if (err) {
            //  return new AppError(httpStatus.NOT_FOUND, "Something went wrong")
            return next(err)
        }

         if(!user){
            // return new AppError(httpStatus.NOT_FOUND, info.mesaage)
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserToken(user)

        // delete user.toObject().password;

        const { password: pas, ...rest } = user.toObject()

        setAuthCookie(res, userTokens)// setAuthCookie te res r login info pathiye diyechi
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "UserLoged Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next)

    // res.cookie("accessToken", logInfo.accessToken,{
    //     httpOnly: true,
    //     secure: false
    // })

    // res.cookie("refreshToken", logInfo.refreshToken,{
    //     httpOnly: true,
    //     secure: false,
    // })

    // cookie setup er kaj setAuthCookie korbe, 

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    // const user = await userServices()
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "Not refresh token recieved from the cookies")
    }
    const tokeInfo = await AuthServices.getNewToken(refreshToken as string);
    setAuthCookie(res, tokeInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New access token retrieved Successfully",
        data: tokeInfo
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "The user has loged out successfully",
        data: null
    })
})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.password;
    const decodedToken = req.user;

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed Successfully",
        data: null
    })
})
const googleCallbackConteoller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user

    console.log("user", user)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    const tokenInfo = createUserToken(user)
    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password changed Successfully",
    //     data: null
    // })

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})



export const authControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackConteoller
}