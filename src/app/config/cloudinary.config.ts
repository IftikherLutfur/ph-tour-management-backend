/* eslint-disable no-console */
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET
})

export const deleteImage = async (url:string) =>{
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i
    const match = url.match(regex)
    if(match && match) {
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId)
        console.log(`File ${publicId} is deleted from the cloudinary`)
    }
    } catch (error) {
        console.log(error)
    }
}

export const cloudinaryUpload = cloudinary;