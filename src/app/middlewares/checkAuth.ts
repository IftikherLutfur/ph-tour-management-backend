import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { envVars } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRole: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new AppError(httpStatus.NOT_FOUND, "No token received");
            }

            const verifiedToken = jwt.verify(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

            const isUserExist = await User.findOne({ email: verifiedToken.email })

            if(isUserExist?.isVarified === false){
                throw new AppError(httpStatus.BAD_REQUEST, "This user is not varified")
            }

            if (!isUserExist) {
                throw new AppError(httpStatus.BAD_REQUEST, "User not exist")
            }
            if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
            }
            if (isUserExist.isDeleted) {
                throw new AppError(httpStatus.BAD_REQUEST, `User id deleted`)
            }
            if (!authRole.includes(verifiedToken.role)) {
                throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted");
            }


            
            req.user = verifiedToken;
            // console.log(verifiedToken);
            next();
        } catch (error) {
            // console.log(error);
            next(error);
        }
    };
};
