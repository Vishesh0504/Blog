import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import {
  verifyUserGoogle,
  verifyUserGithub,
  generateOtp,
  verifyOtp,
} from "./users.controllers";
import { google_auth_options, github_auth_options } from "./auth.config";
import { error } from "console";
import { URL_ORIGIN, cookieOptions } from "../../../constants";
const authRouter = Router();

passport.use(new GoogleStrategy(google_auth_options, verifyUserGoogle));
passport.use(new GithubStrategy(github_auth_options, verifyUserGithub));
// For google auth

authRouter.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get("/login/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: "/login/google",
      failureMessage: true,
      successReturnToOrRedirect: "/",
      successMessage: true,
      session: false,
    },
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        res.redirect("/auth/login/google");
      } else if (user.jwt) {
        console.log(user);
        res.cookie("access_token", user.jwt, cookieOptions);
        if (user.signup) {
          res.redirect(URL_ORIGIN + "/userRole");
        } else {
          res.redirect(URL_ORIGIN + "/dashboard");
        }
      }
      next();
    },
  )(req, res, next);
});

authRouter.get(
  "/login/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

authRouter.get("/login/github/callback", (req, res, next) => {
  passport.authenticate(
    "github",
    {
      failureRedirect: "/login/github",
      failureMessage: true,
      successMessage: true,
      successReturnToOrRedirect: "/",
      session: false,
    },
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        res.redirect("/auth/login/google");
      } else if (user.jwt) {
        console.log(user);
        res.cookie("access_token", user.jwt, cookieOptions);
        if (user.signup) {
          res.redirect(URL_ORIGIN + "/userRole");
        } else {
          res.redirect(URL_ORIGIN + "/dashboard");
        }
      }
      next();
    },
  )(req, res, next);
});

authRouter.post("/local/generateOTP", generateOtp);
authRouter.post("/local/verifyOTP", verifyOtp);

module.exports = {
  authRouter,
};
