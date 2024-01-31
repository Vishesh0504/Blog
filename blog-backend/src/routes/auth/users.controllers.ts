import { db_config } from "../../../constants";
import { StrategyOptions, VerifyCallback } from "passport-oauth2";
import { Profile as GoogleProfile } from "passport-google-oauth20";

const { Client } = require("pg");
const client = new Client(db_config);

// For google authentication
async function verifyUser(
  accessToken: string,
  refreshToken: string | null,
  profile: GoogleProfile,
  done: VerifyCallback,
) {
  let user;
  try {
    await client.connect();
    // console.log(profile)
    user = await client.query(
      "SELECT * FROM user_credentials WHERE issuer = $1 and username = $2",
      ["google", profile.displayName],
    );
    console.log(user);
    if (user.rows.length === 0) {
      const id = await client.query(
        "INSERT INTO user_credentials(username,email,issuer) values($1,$2,$3) RETURNING id",
        [profile.displayName, profile._json.email, "google"],
      );
      const user = {
        id: id,
        name: profile.username,
        email: profile._json.email,
      };
      console.log(user);
      return done(null, user);
    } else {
      return done(null, user[0].displayName);
    }
  } catch (err: any) {
    console.log(err);
    done(err);
  }
}

export { verifyUser };
