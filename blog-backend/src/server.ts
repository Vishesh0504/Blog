import { Response } from "express";
import { db_config } from "../constants";

const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const { connect_db } = require("../constants");
const path = require("path");
const { authRouter } = require("./routes/auth/users.routes");
const cors = require("cors");
const { Client } = require("pg");
require("dotenv").config({ path: "../.env" });
const passport = require("passport");
const PORT = process.env.serverPort;
const { findUserInDB } = require("../src/routes/auth/users.controllers");
const app = express();
const client = new Client(db_config);
app.use(cors());
app.use(logger("dev"));
app.use(helmet());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

findUserInDB();
// console.log();
// connect_db();

app.use("/auth", authRouter);
app.get("/", (req: Request, res: Response) => {
  res.send({ Yay: "you are authenticated" });
});
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
