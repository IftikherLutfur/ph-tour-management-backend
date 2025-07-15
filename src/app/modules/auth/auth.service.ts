import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async(payload: Partial<IUser>)=>{
   const {email, password } = payload;
   const isUserExist = await User.findOne({email}).select('+password')

   if(!isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST, "User not exist")
   }
   
   const isMatch = await bcryptjs.compare(password as string, isUserExist.password as string);

   if(!isMatch){
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
   }


   const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
   }

   const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET,envVars.JWT_TOKEN_EXPIRES as "1h")
 
return {
    // email: isUserExist.email
    accessToken
}

} 

export const AuthServices = {
    credentialsLogin
}