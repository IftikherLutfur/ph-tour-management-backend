import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes"

interface MyJwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const createUserToken = (user: Partial<IUser>) => {
  if (!user._id || !user.email || !user.role) {
    throw new Error("User _id, email, and role are required to generate tokens.");
  }
  const jwtPayload: MyJwtPayload = {
    userId: typeof user._id === "string" ? user._id : user._id.toString(),
    email: user.email,
    role: user.role
  };
  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_TOKEN_EXPIRES);
  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

  return { accessToken, refreshToken };
}

export const createNewAccessTokenWithRefresh = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload
  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not exist")
  }
  if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, `User id deleted`)
  }

  const JwtPayload = {
    userId: isUserExist._id.toString(),
    email: isUserExist.email as string,
    role: isUserExist.role as string
  }

  const accessToken = generateToken(JwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_TOKEN_EXPIRES)

  return accessToken
}