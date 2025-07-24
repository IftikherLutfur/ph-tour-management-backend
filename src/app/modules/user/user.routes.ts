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
route.get("/", checkAuth("ADMIN", "SUPER_ADMIN"), UserContrllers.getAllUsers)
route.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserContrllers.getSingleUser)
route.patch("/:id",validateRequest(updateeUserZodSchema), checkAuth(...Object.values(Role)), UserContrllers.updateUser)




export const UserRoutes = route;