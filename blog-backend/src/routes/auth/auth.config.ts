import { Redis } from "ioredis";
import { StrategyOptions } from "passport-oauth2";
import { StrategyOptions as StrategyOptionsGithub } from "passport-github2";
require("dotenv").config({ path: "../../../.env" });

// google auth
const google_auth_options: StrategyOptions = {
  clientID: process.env.googleClientID!,
  clientSecret: process.env.googleClientSecret as string,
  callbackURL: "https://localhost:8000/auth/login/google/callback",
};

// github auth
const github_auth_options: StrategyOptionsGithub = {
  clientID: process.env.githubClientID!,
  clientSecret: process.env.githubClientSecret!,
  callbackURL: "https://localhost:8000/auth/login/github/callback"!,
};

async function connectRedis() {
  const client = new Redis({
    host: process.env.redisHost!,
    port: +process.env.redisPort!,
    password: process.env.redisPassword!,
  });
  try {
    await client.ping();
    console.log("redis client connected");
    return client;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export { google_auth_options, github_auth_options, connectRedis };
