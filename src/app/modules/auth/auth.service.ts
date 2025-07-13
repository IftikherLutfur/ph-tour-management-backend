import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"

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

//    const {...rest } = isUserExist

return {
    email: isUserExist.email
}

} 

export const AuthServices = {
    credentialsLogin
}