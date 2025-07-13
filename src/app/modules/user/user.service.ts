import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    const userExist = await User.findOne({ email })
     

    if (userExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already exist" )
    }
    
    const hashedPassword = await bcryptjs.hash(password as string , 10)


    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auth: [authProvider],
        ...rest
    })
    return user
}

const getUser = async () => {
    const users = await User.find({})

    const totalUsers = await User.countDocuments()
    return {
        data: users,
        meta: {
            total: totalUsers
        }

    }
}



export const userServices = {
    createUser,
    getUser
}