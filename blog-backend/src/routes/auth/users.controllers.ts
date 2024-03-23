const postmark = require("postmark");
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
import { authenticator } from "otplib";
import { Request, Response } from "express";
import { VerifyCallback } from "passport-oauth2";
import { Profile as GoogleProfile } from "passport-google-oauth20";

require("dotenv").config({ path: "../../../.env" });
import {
  db_config,
  htmlContent,
  cookieOptions,
  URL_ORIGIN,
} from "../../../constants";
import { connectRedis } from "./auth.config";
import * as argon2 from "argon2";
const crypto = require("crypto");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../../../certificates/server.key"),
);
interface user {
  id: number;
  email: string;
  name?: string;
  signup?: boolean;
}
//generate JWT token on successful sign in
async function generateJWT(user: user) {
  try {
    let token = await jwt.sign(user, privateKey, { algorithm: "RS256" });
    return token;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
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
    user = await client.query(
      "SELECT * FROM user_credentials WHERE issuer = $1 and email = $2",
      [issuer, profile._json.email],
    );
    if (user.rows.length === 0) {

      const id = await client.query(

        "INSERT INTO user_credentials(username,email,issuer,picture) values($1,$2,$3,$4) RETURNING id",
        [profile.displayName, profile._json.email, issuer,profile._json.picture],
      );
      const createdUser = {
        id: id.rows[0].id,
        name: profile.displayName,
        email: profile._json.email!,
        picture:profile._json.picture!
      };
      // console.log(createdUser);
      let token = await generateJWT(createdUser);
      return done(null, {
        jwt: token,
        signup: true,
        user: createdUser,
      });
    } else {
      const exisitingUser = {
        id: user.rows[0].id,
        name: user.rows[0].username,
        email: user.rows[0].email,
        picture:user.rows[0].picture
      };
      let token = await generateJWT(exisitingUser);
      return done(null, {
        jwt: token,
        signup: false,
        user: exisitingUser,
      });
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
  return await verifyUser(accessToken, refreshToken, profile, done, "google");
}
//for github auth
async function verifyUserGithub(
  accessToken: string,
  refreshToken: string | null,
  profile: GoogleProfile,
  done: VerifyCallback,
) {
  return await verifyUser(accessToken, refreshToken, profile, done, "github");
}

async function hashingOTP(otp: string, salt: string) {
  const otp_salt = otp + salt;
  try {
    return await argon2.hash(otp_salt, { type: argon2.argon2id });
  } catch (err) {
    throw err;
  }
}
//Generate otp and verify functions for the local email auth workflow

async function generateOtp(req: Request, res: Response) {
  const secret = authenticator.generateSecret();
  const otp = authenticator.generate(secret);
  var client = new postmark.ServerClient(process.env.postmark);
  var redisClient = await connectRedis();
  try {
    const salt = await argon2.hash(crypto.randomBytes(32));
    const hashedOTP = await hashingOTP(otp, salt);
    // console.log("OTP:", otp, "hashedOTP:", hashedOTP, "Salt:", salt);
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
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  } finally {
    await redisClient.quit();
    console.log("redis client disconnected");
  }
}

async function verifyOtp(req: Request, res: Response) {
  var redisClient = await connectRedis();
  const client = new Client(db_config);
  try {
    const hashedOTP = await redisClient.get(`${req.body.email}_hashedOTP`);
    const salt = await redisClient.get(`${req.body.email}_salt`);
    // console.log(req.body)
    // console.log(hashedOTP);

    if (hashedOTP) {
      const combinedOtp = req.body.otp + salt;
      const isOtpValid = await argon2.verify(hashedOTP!, combinedOtp, {
        type: argon2.argon2id,
      });
      if (isOtpValid) {
        let user;
        await client.connect();
        user = await client.query(
          "SELECT * from user_credentials where issuer=$1 and email=$2",
          ["local", req.body.email],
        );
        if (user.rows.length === 0) {
          let id = await client.query(
            "insert into user_credentials (username, email, issuer) values($1,$2,$3) returning id",
            [req.body.email, req.body.email, "local"],
          );
          let createdUser = {
            id: id.rows[0].id,
            name: req.body.displayName,
            email: req.body.email,
          };
          let token = generateJWT(createdUser);
          res
            .status(201)
            .cookie("access_token", token,cookieOptions)
            .json({
              message: "OTP verified,user created",
              redirectUrl: `/onboarding`,
            });
            res.cookie("user", JSON.stringify(createdUser), {
              secure: false,
              sameSite: "lax",
            });
        } else {
          let exisitingUser = {
            id: user.rows[0].id,
            name: user.rows[0].username,
            email: user.rows[0].email,
            picture:user.rows[0].picture
          };
          let token = generateJWT(exisitingUser);
          res
            .status(201)
            .cookie("access_token", token, cookieOptions)
            .json({
              message: "OTP verified,existing user found",
              redirectUrl: `/dashboard`,
            });
            res.cookie("user", JSON.stringify(exisitingUser), {
              secure: false,
              sameSite: true,
              domain: "localhost",
            });
        }
      } else {
        res.status(401).json({ message: "invalid otp provided" });
      }
    } else {
      res.status(410).json({ message: "OTP expired " });
    }
  } catch (err) {
    res.status(500).json(err);
  } finally {
    await client.end();
    await redisClient.quit();
    console.log("client has disconnected");
  }
}

async function fetchTTL(req: Request, res: Response) {
  var redisClient = await connectRedis();
  try {
    const email = req.body.email;
    const ttl = await redisClient.ttl(`${email}_salt`);
    console.log(ttl);
    if (ttl === -2 || ttl === -1) {
      throw Error;
    }
    res.status(200).json({ ttl: ttl });
  } catch (err) {
    // console.log(err);
    res.status(500);
  } finally {
    await redisClient.quit();
    console.log("redis client disconnected");
  }
}


async function updateProfile(req:Request,res:Response){
  const id = req.user!.id;
  const client = new Client(db_config);
  try{
    await client.connect();
    await client.query("Update user_credentials set username =$1,picture=$2 where id=$3",[req.body.name,req.body.imgURL,id])
    const updatedUser ={
      id :id,
      name:req.body.name,
      email:req.user?.email,
      picture:req.body.imgURL
    };
    res.status(200).cookie("user", JSON.stringify(updatedUser), {
      secure: false,
      sameSite: true,
    }).json({message:"User Updated successfully"});
  }catch(err)
  {
    console.log(err);
    res.status(500).send({message:err})
    process.exit(1);
  }
}

async function handleLogOut(req:Request,res:Response){
  return res.clearCookie("access_token",cookieOptions).status(200).json({message:"Logged out successfully"});
}


export { verifyUserGoogle, verifyUserGithub, generateOtp, verifyOtp, fetchTTL,updateProfile,handleLogOut};
