const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const { StrategyOptions } = require("passport-google-oauth20");

require("dotenv").config({ path: "../.env" });
const db_config = {
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.PORT,
  database: process.env.database,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, "../certificates/ca.pem")),
  },
};

function connect_db() {
  const client = new Client(db_config);
  client.connect(function (err: any) {
    if (err) throw err;
    client.query(
      "SELECT VERSION()",
      [],
      function (err: any, result: { rows: any[] }) {
        if (err) throw err;

        console.log(result.rows[0]);
      },
    );
  });
}

function htmlContent(email: string, otp: string): string {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account on TheCodeConundrum.tech</title>
</head>
<body>
  <h1>Verify Your Account on TheCodeConundrum.tech</h1>
  <p>Hi ${email},</p>
  <p>We've received a request to verify your account on TheCodeConundrum. Your one-time password (OTP) is:</p>
  <h2 style="font-size: 24px; font-weight: bold;">${otp}</h2>
  <p>Please enter this code in the verification field to complete your registration.</p>
  <p>This code is valid for only 5 minutes. For security reasons, please do not share this code with anyone.</p>
  <p>If you didn't request this verification, please ignore this email and contact us immediately at [Support Email Address].</p>
  <br>
  <p>Sincerely,</p>
  <p>TheCodeConundrum Team</p>
</body>
</html>
`;
  return htmlContent;
}

const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 7);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "prod",
  expires: expirationDate,
};
const URL_ORIGIN = "http://localhost:5173";
export { connect_db, db_config, htmlContent, cookieOptions, URL_ORIGIN };
