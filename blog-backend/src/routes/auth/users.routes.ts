import { Router } from "express";
import { verifyAuthentication } from "../../protected";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import {
  verifyUserGoogle,
  verifyUserGithub,
  generateOtp,
  verifyOtp,
  fetchTTL,
  updateProfile,
  handleLogOut,
  setRole,
} from "./users.controllers";
import { google_auth_options, github_auth_options } from "./auth.config";
import { URL_ORIGIN, cookieOptions } from "../../../constants";
const authRouter = Router();

passport.use(new GoogleStrategy(google_auth_options, verifyUserGoogle));
passport.use(new GithubStrategy(github_auth_options, verifyUserGithub));
// For google auth
authRouter.get("/logout", handleLogOut);
authRouter.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get("/login/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    {
      session: false,
    },
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        res.redirect(URL_ORIGIN + "/login");
      } else if (user.jwt) {
        res.cookie("access_token", user.jwt, {
          sameSite: "strict",
          secure: true,
          domain: "localhost",
          httpOnly: true,
          expires: cookieOptions.expires,
        });
        res.cookie("user", JSON.stringify(user.user), {
          secure: false,
          sameSite: true,
          domain: "localhost",
        });
        if (user.signup) {
          return res.redirect(URL_ORIGIN + "/onboarding");
        } else {
          return res.redirect(URL_ORIGIN + "/dashboard");
        }
      }
      next();
    },
  )(req, res, next);
});

//For github oauth
authRouter.get(
  "/login/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

authRouter.get("/login/github/callback", (req, res, next) => {
  passport.authenticate(
    "github",
    {
      session: false,
    },
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Login/Signup failed please try again" });
        // return res.redirect(URL_ORIGIN + "/login");
      } else if (user.jwt) {
        res
          .cookie("access_token", user.jwt, cookieOptions)
          .cookie("user", JSON.stringify(user.user), {
            secure: false,
            sameSite: true,
            domain: "localhost",
          });
        if (user.signup) {
          res.redirect(URL_ORIGIN + "/onboarding");
        } else {
          res.redirect(URL_ORIGIN + "/dasboard");
        }
      }
      next();
    },
  )(req, res, next);
});

authRouter.post("/local/generateOTP", generateOtp);
authRouter.post("/local/verifyOTP", verifyOtp);

authRouter.post("/fetchTTL", fetchTTL);
authRouter.post("/updateProfile", verifyAuthentication, updateProfile);
authRouter.post("/updateProfile/setRole", verifyAuthentication, setRole);

module.exports = {
  authRouter,
};
