/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();
 
router.post("/login", authControllers.credentialsLogin)
router.post("/refresh-token", authControllers.getNewAccessToken)
router.post("/logout", authControllers.logout)
router.post("/reset-password", checkAuth(...Object.values(Role)), authControllers.resetPassword)
router.get(  "/google",async(req: Request, res: Response, next: NextFunction)=>{
         const redirect = req.query.redirect || "/"
        passport.authenticate("google", 
       {scope: ["profile", "email"],session: true, state: redirect as string})(req,res,next)})
    

// Handle Google OAuth callback
router.get("/google/callback", passport.authenticate("google", 
    {failureRedirect: "/login", // or your frontend login page
    session: true,}),authControllers.googleCallbackConteoller);

export const AuthRoutes = router;