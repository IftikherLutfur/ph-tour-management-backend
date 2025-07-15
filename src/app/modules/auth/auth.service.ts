/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { generateToken, MyJwtPayload } from "../../utils/jwt";
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


   const jwtPayload: MyJwtPayload = {
    userId: isUserExist._id.toString(),
    email: isUserExist.email,
    role: isUserExist.role as string
   }

   const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET,envVars.JWT_TOKEN_EXPIRES)

   const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES as string)
 
   const {password: pass, ...rest} = isUserExist
return {
    // email: isUserExist.email
    accessToken,
    refreshToken,
    user: rest
}

} 

export const AuthServices = {
    credentialsLogin
}