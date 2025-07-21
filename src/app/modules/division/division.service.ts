import { IDivision } from "./division.interface"
import { Division } from "./division.model";

const createDivision = async(payload: Partial<IDivision>)=>{
     const {name, slug, ...rest} = payload;
     const create  = await Division.create({
        name,
        slug,
        rest
     })

     return create
}

const getDivisionData = async()=>{
    const divison = await Division.find({})
    return divison;
}

const getSigleDIvision = async(slug: string) =>{
    const division = await Division.findOne({slug})
    return{
        data: division
    }
}

const updateDivision = async(id: string, payload: Partial<IDivision>)=>{
    const isDivisionExist = await Division.findById(id);
    if(!isDivisionExist){
        throw new Error("Division not found")
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id:{$ne: id}
    })
    if(duplicateDivision){
        throw new Error("A Division with this name already exists")
    }
    const division = await Division.findByIdAndUpdate(id, payload, {
        new: true,
    })
    return division;
}

const deleteDivision =  async(id: string)=>{
     await Division.findByIdAndDelete(id);
    return null;
}

export const DivisionServices ={
    createDivision,
    getDivisionData,
    getSigleDIvision,
    updateDivision,
    deleteDivision
}