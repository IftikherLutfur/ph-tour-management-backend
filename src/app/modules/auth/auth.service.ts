/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { generateToken, MyJwtPayload, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefresh, createUserToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail";

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

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }
    if (user.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password already set")
    }
    if (user?.password && user?.auth?.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set password")
    }
    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )
    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auth || [], credentialProvider]

    user.password = hashedPassword
    user.auth = auths
    await user.save()
    return "This is not ideal to see the password"
}

const resetPassword = async ( payload: Record<string, any>, decodedToken: JwtPayload) => {
     if(payload.id!== decodedToken.userId){
        throw new AppError(401, "You cannot reset your password")
     }

     const isUserExist = await User.findById(decodedToken.userId)
     if(!isUserExist){
        throw new AppError(401, "This user is not exist")
     }

      const hashedPassword = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))

      isUserExist.password = hashedPassword;
      await isUserExist.save()
    
    return {}
}

const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "This is user is not exist")
    }
    if (isUserExist.isVarified === false) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not varified, please contac with our support team")
    }
    if (isUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not available to do anything, please contac with our support team")
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is deleted")
    }

    const JwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetURL = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    await sendEmail({
        to: isUserExist.email,
        subject: "Reset Password",
        templateName: "forgetPassword",
        templateData: {
            resetUILink: `${process.env.FRONTEND_URL}/reset-password?token=${resetURL}`
        }
    });

    return null
}
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

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
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword
}