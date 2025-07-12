import { Types } from "mongoose"

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export interface IAuthProvider {
    provider: "google" | "credentials",
    providerId: string
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    name: string,
    email: string,
    role?: Role,
    password?: string,
    phone?: string,
    picture?: string,
    address?: string,
    isDeleted?: boolean,
    isActive?: IsActive,
    isVarified?: boolean,

    auth?: IAuthProvider[],
    bookings?: Types.ObjectId[],
    guides?: Types.ObjectId[]



}