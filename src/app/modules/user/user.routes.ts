import { Router } from "express";
import { UserContrllers } from "./user.controller";
import { createUserZodSchema, updateeUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
const route = Router();

route.post("/register", 
    validateRequest(createUserZodSchema), 
    UserContrllers.createUser)
route.get("/all-user", checkAuth("ADMIN", "SUPER_ADMIN"), UserContrllers.getAllUsers)
route.patch("/:id",validateRequest(updateeUserZodSchema), checkAuth(...Object.values(Role)), UserContrllers.updateUser)




export const UserRoutes = route;