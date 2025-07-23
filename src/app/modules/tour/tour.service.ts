/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField, tourSearchFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourTypeModel } from "./tour.model";
import { QueryBuilders } from "../../utils/QueryBuilder";


// Create a new tour
const createTour = async (payload: Partial<ITour>) => {
    const { title, ...rest } = payload;
    const create = await Tour.create({
        title,
        ...rest
    })
    return create;
}




const getTours = async (query: Record<string, string>) => {
    
    const queryBuilder = new QueryBuilders(Tour.find(), query)
    const find = await queryBuilder.search(tourSearchFields).filter().modelQuery

    // const totalTours = await Tour.countDocuments()
    // const totalPage = Math.ceil(totalTours / limit)

    // const meta = {
    //     page: page,
    //     total: totalTours,
    //     limit: limit,
    //     totalPage: totalPage

    // }

    return {
        data: find,
        // meta: meta
    };
}



// Find all tours
// const getTours = async (query: Record<string, string>) => {

//     const filter = query
//     const searchTerm = query.searchTerm || "";
//     const sort = query.sort || "-createdAt";
//     const fields = query.fields?.split(",").join(" ") || "";
//     const page = Number(query.page) || 1 ;
//     const limit = Number(query.limit) || 10;
//     const skip = (page-1)*limit


//     for(const field of excludeField){
//         delete filter[field]
//     }

//     const searchQuery = {
//         $or: tourSearchFields.map(field => ({
//         [field]: { $regex: searchTerm, $options: "i" }
//     }))}

//     const find = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit)

//     const totalTours = await Tour.countDocuments()
//     const totalPage = Math.ceil(totalTours/limit)

//     const meta = {
//      page: page,
//      total: totalTours,
//      limit: limit,
//      totalPage: totalPage

//     }

//     return{
//   data: find,
//   meta:meta
//     } ;
// }

// FInd single tour 
const getSingleTour = async (id: string) => {
    const tour = await Tour.findById(id);
    return tour;
}

// update tour
const TourUpdate = async (id: string, payload: Partial<ITour>) => {
    // const {title, ...rest} = payload;
    const isTourExist = await Tour.findById(id);
    if (!isTourExist) {
        throw new Error("Tour not found")
    }

    const update = await Tour.findByIdAndUpdate(id, payload, { new: true })
    return update;

}

const tourDelete = async (id: string) => {
    const deleteTour = await Tour.findByIdAndDelete(id)
    return deleteTour;
};

// Create tours types
const tourTypeCreate = async (payload: Partial<ITourType>) => {
    const { name } = payload;
    const create = await TourTypeModel.create({
        name
    })
    return create;
}

// Find all tours types
const getTourType = async () => {
    const find = await TourTypeModel.find({})
    return find;
}

// Update a tour type
const updatedTour = async (id: string, payload: ITourType) => {
    //    const { name} = payload;
    const isExist = await TourTypeModel.findById(id)
    if (!isExist) {
        throw new Error("This tour type does not exist")
    }
    const update = await TourTypeModel.findByIdAndUpdate(id, payload, { new: true })
    return update;
}

// Delete a tour type
const tourTypeDelete = async (id: string) => {
    const deleted = await TourTypeModel.findByIdAndDelete(id)
    return deleted;
}



export const TourTypeService = {
    createTour,
    getTours,
    getSingleTour,
    TourUpdate,
    tourDelete,
    tourTypeCreate,
    getTourType,
    updatedTour,
    tourTypeDelete
}