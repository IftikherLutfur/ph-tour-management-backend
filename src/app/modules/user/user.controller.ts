/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";



// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
        
//         // throw new AppError(httpStatus.BAD_REQUEST, "Fake error")
//         // const user = await userServices.createUser(req.body)
//         // res.status(httpStatus.CREATED).json({
//         //     message: "User created successfully",
//         //     user
//         // })
//     } catch (err: any) {
//         // eslint-disable-next-line no-console
//        console.log(err)
//        next(err)
//     }
// }

const createUser = catchAsync (async(req:Request, res:Response, next:NextFunction)=>{
    const user = await userServices.createUser(req.body)

     sendResponse(res,{
            success: true,
            statusCode:httpStatus.CREATED,
            message: "User Created successfully",
            data: user

        })
    
})
const getAllUsers = catchAsync(async(req: Request, res:Response, next: NextFunction) =>{
    
        const result = await userServices.getUser()
        // res.status(httpStatus.OK).json({
        //     message:"User retrived successfully",
        //     users
        // })

        sendResponse(res,{
            success: true,
            statusCode: httpStatus.OK,
            message: "All user retireved successfully",
            data: result.data,
            // meta: result.meta

        })
    
})

const getMe = catchAsync(async(req:Request, res:Response)=>{
    const decodedToken = req.user as JwtPayload;
    const getSelfProfile = await userServices.getMe(decodedToken.userId)
     sendResponse(res,{
            success: true,
            statusCode:httpStatus.CREATED,
            message: "Retrieved your personal info",
            data: getSelfProfile

        })
})

const getSingleUser = catchAsync(async(req:Request, res: Response)=>{
        const userId = req.params.id;
        const user = await userServices.singleUser(userId)
        sendResponse(res,{
            success: true,
            statusCode:httpStatus.CREATED,
            message: "Single user retrived",
            data: user
        })
}) 

const updateUser = catchAsync (async(req:Request, res:Response, next:NextFunction)=>{
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verfiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verfiedToken = req.user;
    const payload = req.body;
    const user = await userServices.updateUser(userId,payload,verfiedToken as JwtPayload)

     sendResponse(res,{
            success: true,
            statusCode:httpStatus.CREATED,
            message: "User Updated successfully",
            data: user

        })
    
})

export const UserContrllers = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUser,
    getMe
}