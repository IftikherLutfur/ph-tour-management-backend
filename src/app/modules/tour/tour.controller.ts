import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { TourTypeService } from "./tour.service";
import { ITour } from "./tour.interface";


// Create a new tour
const createTour = async(req: Request, res: Response) => {
    const payload : ITour ={
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file=>file.path)
    }
    const tour = await TourTypeService.createTour(payload)
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Tour created successfully",
        data: tour
    })
}

// FInd all tours

const getTours = async(req:Request, res: Response)=>{
    const query = req.query;
      const tours = await TourTypeService.getTours(query as Record<string,string>)
      sendResponse(res,{
        success: true,
        statusCode: 200,
        message: "All tours retrieved successfully",
        data: tours
      })
}

// Update a tour

const updateTour = async(req:Request, res: Response) =>{
    const id = req.params.id;
    const payload : ITour ={
        ...req.body,
        images: req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : []
    }
    const tourUpdate = await TourTypeService.TourUpdate(id, payload);
    sendResponse(res,{
        success: true,
        statusCode: 200,
        message: "Tour updated successfully",
        data: tourUpdate
    })
}

const deleteTour = async(req: Request, res: Response)=>{
    const id = req.params.id;
    await TourTypeService.tourDelete(id)
    sendResponse(res,{
        success: true,
            statusCode: 200,
            message: "Tour  deleted successfully",
            data: null
    })
     
}

// Find a single tour
const getSingleTour = async(req: Request, res: Response) => {
    const id = req.params.id;
    const tour = await TourTypeService.getSingleTour(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Single tour retrieved successfully",
        data: tour
    })
}



// -------------Tour Types-----------
// Create a new tour type
const createTourTypes = async(req: Request, res: Response) =>{
    const payload = req.body;
    const tourType = await TourTypeService.tourTypeCreate(payload)
    sendResponse(res,{
        success: true,
            statusCode: 200,
            message: "Division deleted successfully",
            data: tourType
    })
}

// Find all tour types
const tourTypeFind = async(req: Request, res: Response) =>{
    // const payload = req.body;
    const tourType = await TourTypeService.getTourType()
    sendResponse(res,{
        success: true,
            statusCode: 200,
            message: "All tour types retrieved successfully",
            data: tourType
    })
}

// Update a tour type
const tourTypeUpdated = async(req: Request, res: Response) =>{
    const id = req.params.id
    const payload = req.body;
    const tourType = await TourTypeService.updatedTour(id,payload)
    sendResponse(res,{
        success: true,
            statusCode: 200,
            message: "Tour type updated successfully",
            data: tourType
    })
}

// Delete a tour type
const tourTypeDelete = async(req: Request, res: Response) =>{
    const id = req.params.id
   await TourTypeService.tourTypeDelete(id)
    sendResponse(res,{
        success: true,
            statusCode: 200,
            message: "Tour type deleted successfully",
            data: null
    })
}


export const TourTypeController = {
    createTour,
    getTours,
    getSingleTour,
    updateTour,
    deleteTour,
    createTourTypes,
    tourTypeFind,
    tourTypeUpdated,
    tourTypeDelete
}