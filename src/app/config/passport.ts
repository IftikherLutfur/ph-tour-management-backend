/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes"
import AppError from "../errorHelpers/AppError";

// Local Strategy (Email & Password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email }).select("+password +auths"); // Include password if hidden by default


        const isGoogleAuthenticated = user?.auth?.some(authObj => authObj.provider === "google");

        console.log(isGoogleAuthenticated, "passport.js")

        if (isGoogleAuthenticated && user?.password) {
          return done(null, false, {
            message:
              "You have authenticated with Google. To log in with credentials, please set a password first after logging in with Google.",
          });
        }
        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        if (!user?.password) {
          return done(null, false, {
            message: "No password set. Please set a password first.",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(password, user.password);

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password doesn't match" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "User is not exist" });
        }
        if (isUserExist && !isUserExist.isVarified) {
          return done(null, false, { message: "User is not varified" });
        }
        if (isUserExist && (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE)) {
          return done(null, false, { message: `User is ${IsActive}` });
        }
        if (isUserExist.isDeleted) {
          throw new AppError(httpStatus.BAD_REQUEST, `User id deleted`)
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auth: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
