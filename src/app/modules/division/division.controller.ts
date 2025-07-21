/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { Division } from "./division.model";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionServices } from "./division.service";
import { catchAsync } from "../../utils/catchAsync";

const createDivision = async (req: Request, res: Response, next: NextFunction) => {
    // const {name, slug, ...rest} = req.body;
    const division = await DivisionServices.createDivision(req.body)
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Division created successfully",
        data: division
    })
}

const getDivision = async (req: Request, res: Response, next: NextFunction) => {
      const result = await DivisionServices.getDivisionData()
      sendResponse(res,{
            success: true,
            statusCode: 201,
            message: "All Division retireved successfully",
            data: result

        })
}


const getSingleDivision = catchAsync(async(req:Request, res:Response)=>{
    const slug = req.params.slug;
    const result = await DivisionServices.getSigleDIvision(slug)

    sendResponse(res,{
            success: true,
            statusCode: 201,
            message: "Single Division retireved successfully",
            data: result

        })
})

const updateDivision = catchAsync(async(req: Request, res: Response) => {
    const id = req.params.id;
    const result = await DivisionServices.updateDivision(id, req.body)

    sendResponse(res,{
            success: true,
            statusCode: 200,
            message: "Division updated successfully",
            data: result

        })
})

const deleteDivision = catchAsync(async(req: Request, res: Response) => {
    const id = req.params.id;
    await DivisionServices.deleteDivision(id)

    sendResponse(res,{
            success: true,
            statusCode: 200,
            message: "Division deleted successfully",
            data: null

        })
})



export const DivisionController = {
    createDivision,
    getDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
}