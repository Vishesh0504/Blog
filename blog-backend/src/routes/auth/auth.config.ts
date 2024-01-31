import { StrategyOptions } from "passport-oauth2";
require("dotenv").config({ path: "../../../.env" });

//
const google_auth_options: StrategyOptions = {
  clientID: process.env.googleClientID!,
  clientSecret: process.env.googleClientSecret as string,
  callbackURL: "https://localhost:8000/auth/login/google/callback",
};

export { google_auth_options };
