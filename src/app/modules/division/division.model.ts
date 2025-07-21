import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>({
    name: { type: String, required: true, unique: true },
    slug: { type: String,  required:true, unique: true },
    thumbnail: { type: String, required:false },
    description: { type: String, required:false}
}, {
    timestamps: true,
    versionKey:false
})

export const Division = model<IDivision>("Division", divisionSchema)