import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {Strategy as GithubStrategy} from "passport-github2"
import { verifyUserGoogle, verifyUserGithub} from "./users.controllers";
import { google_auth_options,github_auth_options} from "./auth.config";
const authRouter = Router();

passport.use(new GoogleStrategy(google_auth_options, verifyUserGoogle));
passport.use(new GithubStrategy(github_auth_options,verifyUserGithub))
// For google auth

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

authRouter.get("/login/github",passport.authenticate("github",{scope:['user:email']}));
authRouter.get("/login/github/callback",passport.authenticate("github",{failureRedirect:'/login/github',failureMessage:true,successMessage:true,successReturnToOrRedirect:'/',session:false }));

authRouter.post("/signup/local");
authRouter.post("/login/local");

module.exports = {
  authRouter,
};
