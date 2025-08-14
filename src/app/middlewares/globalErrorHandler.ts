/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { ZodError } from "zod";
import { deleteImage } from "../config/cloudinary.config";

export const globalErrorHandler = async(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = `Something went wrong`;
    let errorMessages: string[] = [];


    const duplicateError = (err: any) => {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return { field, value };
    }
    if(req.file){
        await deleteImage(req.file.path)
    }
    if (Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
        await Promise.all(imageUrls.map(url => deleteImage(url)));
    }

    // ✅ Handle Zod validation errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation error";
        errorMessages = err.errors.map((issue) => {
            return `${issue.path.join(".")}: ${issue.message}`;
        });
    }

    // ✅ Handle MongoDB Duplicate Key Error (code: 11000)
    else if (err.code === 11000) {
        const {field,value}= duplicateError(err)
        statusCode = 400;
        message = `${field} "${value}" already exists`;
    }

    // ✅ Handle custom AppError
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // ✅ Generic built-in Error object
    else if (err instanceof Error) {
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(errorMessages.length > 0 && { errorMessages }), // only show if Zod errors exist
        stack: envVars.NODE_ENV === "developement" ? err.stack : null,
    });
};
