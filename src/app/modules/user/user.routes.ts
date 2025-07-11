import { Router } from "express";
import { UserContrllers } from "./user.controller";


const route = Router()

 route.post("/register", UserContrllers.createUser)
 route.get("/all-user", UserContrllers.getAllUsers)
 

 export const UserRoutes = route;