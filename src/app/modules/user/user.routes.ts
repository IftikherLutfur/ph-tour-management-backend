/* eslint-disable no-console */
import { Router } from "express";
import { UserContrllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";


const route = Router();

route.post("/register", validateRequest(createUserZodSchema), UserContrllers.createUser)
route.get("/all-user", UserContrllers.getAllUsers)


export const UserRoutes = route;