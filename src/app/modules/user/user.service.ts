/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    const userExist = await User.findOne({ email })


    if (userExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already exist")
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }
    const user = await User.create({
        email,
        password: hashedPassword,
        auth: [authProvider],
        ...rest
    })
    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This user does not exist");
  }

  // ✅ শুধু SUPER_ADMIN পারবে
  if (decodedToken.role !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update users");
  }

  // ✅ password encrypt
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, envVars.BCRYPT_SALT_ROUND);
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};          

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
    getUser,
    updateUser
}