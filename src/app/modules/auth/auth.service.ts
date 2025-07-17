/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { generateToken, MyJwtPayload, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefresh, createUserToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email }).select('+password')

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not exist")
    }

    const isOldPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const isMatch = await bcryptjs.compare(password as string, isUserExist.password as string);

    if (!isMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }
    const userToken = createUserToken(isUserExist)

    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        // email: isUserExist.email
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }
}

const getNewToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefresh(refreshToken)

    return {
        // email: isUserExist.email
        accessToken: newAccessToken
    }

}

const resetPassword =
    async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

        const user = await User.findById(decodedToken.userId).select('+password');
        if (!user || typeof user.password !== "string") {
            throw new AppError(httpStatus.UNAUTHORIZED, "User not found or password is invalid");
        }
        const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isOldPasswordMatch) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not matched")
        }

        user!.password = await bcryptjs.hash(newPassword as string, Number(envVars.BCRYPT_SALT_ROUND))
        
        user!.save()
        return true;
    }


export const AuthServices = {
    credentialsLogin,
    getNewToken,
    resetPassword
}