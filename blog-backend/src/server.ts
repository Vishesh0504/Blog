import { NextFunction, Request, Response } from "express";
import { URL_ORIGIN } from "../constants";
const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");
const helmet = require("helmet");
const logger = require("morgan");

const { authRouter } = require("./routes/auth/users.routes");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const passport = require("passport");
const PORT = process.env.serverPort;
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(helmet());
app.use(cookie_parser());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

const verifyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.cookies);
  let token = req.cookies.access_token;
  if (!token) {
    res.status(403).json({ message: "user is not authorized" });
    return res.redirect(URL_ORIGIN + "/login");
  } else {
    const privateKey = fs.readFileSync(
      path.join(__dirname, "../certificates/server.key"),
    );
    let decodedUser = jwt.verify(token, privateKey, { algorithm: "HS256" });
    req.user = decodedUser;
  }
  next();
};

https
  .createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "../certificates/key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "../certificates/cert.pem")),
    },
    app,
  )
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
