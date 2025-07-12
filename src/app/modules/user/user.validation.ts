import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string({ invalid_type_error: "Name must be string" }).min(2, { message: "Name too short, Minimum 2 character long" }).max(50, { message: "Name too long it" }),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .optional(),

    phone: z.string().optional(),

    address: z.string().max(200, { message: "Address cannot exceed 200 characters" }).optional(),

})

export const updateeUserZodSchema = z.object({
    name: z.string({ invalid_type_error: "Name must be string" }).min(2, { message: "Name too short, Minimum 2 character long" }).max(50, { message: "Name too long it" }).optional(),
    password: z.string().min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .optional(),

    phone: z.string().optional(),

    role: z.enum(Object.keys(Role) as [string]),
    IsActive: z.enum(Object.values(IsActive) as [string]),
    isDeleted: z.boolean({invalid_type_error:"isDeleted must be true or false"}).optional(),
    isVerified: z.boolean({invalid_type_error: "isVerified must be true or false"}).optional(), 
    address: z.string().max(200, { message: "Address cannot exceed 200 characters" }).optional(),

})