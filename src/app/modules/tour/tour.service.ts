import { ITour, ITourType } from "./tour.interface";
import { Tour, TourTypeModel } from "./tour.model";


// Create a new tour
const createTour = async (payload: Partial<ITour>)=>{
    const {title, ...rest} = payload;
    const create = await Tour.create({
        title,
        ...rest
    })
    return create;
}

// Find all tours
const getTours = async () =>{
    const find= await Tour.find({})
    return find;
}

// FInd single tour 
const getSingleTour = async(id: string)=>{
    const tour = await Tour.findById(id);
    return tour;
}

// update tour
const TourUpdate = async (id: string, payload: Partial<ITour>)=>{
    // const {title, ...rest} = payload;
    const isTourExist = await Tour.findById(id);
    if(!isTourExist){
        throw new Error("Tour not found")
    }

    const update =  await Tour.findByIdAndUpdate(id, payload, {new: true})
    return update;

}

const tourDelete = async(id: string)=>{
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