import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/login", authControllers.credentialsLogin)

export const AuthRoutes = router;