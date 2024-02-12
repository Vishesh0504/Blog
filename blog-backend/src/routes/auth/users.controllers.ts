const postmark = require("postmark");
const { Client } = require("pg");
import { authenticator } from "otplib";
import { Request, Response } from "express";
import { VerifyCallback } from "passport-oauth2";
import { Profile as GoogleProfile } from "passport-google-oauth20";
require("dotenv").config({ path: "../../../.env" });
import { db_config, htmlContent } from "../../../constants";
import { connectRedis } from "./auth.config";
import * as argon2 from "argon2";
const crypto = require("crypto");
//verify function that goes into the google and github callback
async function verifyUser(
  accessToken: string,
  refreshToken: string | null,
  profile: GoogleProfile,
  done: VerifyCallback,
  issuer: string,
) {
  let user;
  const client = new Client(db_config);
  try {
    await client.connect();
    // console.log(profile)
    user = await client.query(
      "SELECT * FROM user_credentials WHERE issuer = $1 and username = $2",
      [issuer, profile.displayName],
    );
    // console.log(user);
    if (user.rows.length === 0) {
      const id = await client.query(
        "INSERT INTO user_credentials(username,email,issuer) values($1,$2,$3) RETURNING id",
        [profile.displayName, profile._json.email, issuer],
      );
      const createdUser = {
        id: id,
        name: profile.username,
        email: profile._json.email,
      };
      console.log(createdUser);
      return done(null, createdUser);
    } else {
      return done(null, user.rows[0].username);
    }
  } catch (err: any) {
    console.log(err);
    done(err);
  } finally {
    await client.end();
    console.log("client has disconnected");
  }
}
// For google authentication
async function verifyUserGoogle(
  accessToken: string,
  refreshToken: string | null,
  profile: GoogleProfile,
  done: VerifyCallback,
) {
  return verifyUser(accessToken, refreshToken, profile, done, "google");
}
//for github auth
async function verifyUserGithub(
  accessToken: string,
  refreshToken: string | null,
  profile: GoogleProfile,
  done: VerifyCallback,
) {
  return verifyUser(accessToken, refreshToken, profile, done, "github");
}

async function hashingOTP(otp: string, salt: string) {
  const otp_salt = otp + salt;
  try {
    return await argon2.hash(otp_salt, { type: argon2.argon2id });
  } catch (err) {
    throw err;
  }
}

async function generateOtp(req: Request, res: Response) {
  const secret = authenticator.generateSecret();
  const otp = authenticator.generate(secret);
  var client = new postmark.ServerClient(process.env.postmark);
  try {
    var redisClient = await connectRedis();
    const salt = await argon2.hash(crypto.randomBytes(32));
    const hashedOTP = await hashingOTP(otp, salt);
    console.log("OTP:", otp, "hashedOTP:", hashedOTP, "Salt:", salt);
    await redisClient.set(`${req.body.email}_hashedOTP`, hashedOTP);
    await redisClient.expire(`${req.body.email}_hashedOTP`, 300);
    await redisClient.set(`${req.body.email}_salt`, salt);
    await redisClient.expire(`${req.body.email}_salt`, 300);

    await client.sendEmail({
      From: "verifyuser@thecodeconundrum.tech",
      To: req.body.email,
      Subject: "OTP from TheCodeConundrum.tech",
      HtmlBody: htmlContent(req.body.email, otp),
      TextBody: "OTP verification from user!",
      MessageStream: "otp-verification",
    });
    res.status(200).json({
      OTP: "OTP sent successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}
async function verifyOtp(req: Request, res: Response) {
  var redisClient = await connectRedis();
  try {
    const hashedOTP = await redisClient.get("${req.body.email}_hashedOTP");
    const salt = await redisClient.get("${req.body.email}_salt");
    // console.log("V_salt:",salt);
    if (hashedOTP) {
      const combinedOtp = req.body.otp + salt;
      // console.log("combinedOTP:",combinedOtp);
      const isOtpValid = await argon2.verify(hashedOTP!, combinedOtp, {
        type: argon2.argon2id,
      });
      if (isOtpValid) {
        res.status(201).json({ message: "valid otp given by user" });
      } else {
        res.status(401).json({ message: "invalid otp provided" });
      }
    } else {
      res.status(410).json({ message: "OTP expired " });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

export { verifyUserGoogle, verifyUserGithub, generateOtp, verifyOtp };
