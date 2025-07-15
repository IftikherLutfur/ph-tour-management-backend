/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { envVars } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken"

export const checkAuth = (...authRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new AppError(httpStatus.NOT_FOUND, "No token received");
            }

            const verifiedToken = jwt.verify(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;
            if (!authRole.includes(verifiedToken.role)) {
                throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted");
            }

            req.user = verifiedToken;
            console.log(verifiedToken);
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};
