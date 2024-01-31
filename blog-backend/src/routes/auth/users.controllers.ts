import { db_config } from "../../../constants";
import {  VerifyCallback } from "passport-oauth2";
import { Profile as GoogleProfile } from "passport-google-oauth20";
// import {Profile as GithubProfile} from "passport-github2"
const { Client } = require("pg");



async function verifyUser(
  accessToken: string,
  refreshToken: string | null,
  profile: GoogleProfile,
  done: VerifyCallback,
  issuer:string,
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
  }finally{
    await client.end()
    console.log("client has disconnected")
  }
}
// For google authentication
async function verifyUserGoogle(
    accessToken: string,
    refreshToken: string | null,
    profile: GoogleProfile,
    done: VerifyCallback,
  ){
    return verifyUser(accessToken,refreshToken,profile,done,"google")
  }
//for github auth
async function verifyUserGithub(
    accessToken: string,
    refreshToken: string | null,
    profile: GoogleProfile,
    done: VerifyCallback,
  ){
    return verifyUser(accessToken,refreshToken,profile,done,"github")
  }

export { verifyUserGoogle,verifyUserGithub};
