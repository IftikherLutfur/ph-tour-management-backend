/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


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
            meta: result.meta

        })
    
})

export const UserContrllers = {
    createUser,
    getAllUsers
}