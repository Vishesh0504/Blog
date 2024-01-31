import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { verifyUser } from "./users.controllers";
import { google_auth_options } from "./auth.config";
const authRouter = Router();

passport.use(new GoogleStrategy(google_auth_options, verifyUser));

authRouter.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get(
  "/login/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/google",
    failureMessage: true,
    successReturnToOrRedirect: "/",
    successMessage: true,
    session: false,
  }),
);

authRouter.get("/login/github");
authRouter.get("/login/github/callback");

authRouter.post("/signup/local");
authRouter.post("/login/local");

module.exports = {
  authRouter,
};
