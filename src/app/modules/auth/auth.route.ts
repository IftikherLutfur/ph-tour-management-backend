/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();

router.post("/login", authControllers.credentialsLogin)
router.post("/refresh-token", authControllers.getNewAccessToken)
router.post("/logout", authControllers.logout)
router.post("/change-password",
    checkAuth(...Object.values(Role)), authControllers.changePassword)
    router.post("/set-password",
        checkAuth(...Object.values(Role)), authControllers.setPassword)
        router.post("/forgot-password", authControllers.forgotPassword)
        router.post("/reset-password",
            checkAuth(...Object.values(Role)), authControllers.resetPassword)
    

router.get("/google", 
    // checkAuth(...Object.values(Role)),
    async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google",
        { scope: ["profile", "email"], session: true, state: redirect as string })(req, res, next)
})


// Handle Google OAuth callback
router.get("/google/callback", passport.authenticate("google",
    {
        failureRedirect: `${envVars.FRONTEND_URL}?error=There is some issue on your account please contac with our support team`, // or your frontend login page
        session: true,
    }), authControllers.googleCallbackConteoller);

export const AuthRoutes = router;