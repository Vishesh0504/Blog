import { Response } from "express";
const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");
const { authRouter } = require("./routes/auth/users.routes");
const cors = require("cors");
import { connectRedis } from "./routes/auth/auth.config";
require("dotenv").config({ path: "../.env" });

const passport = require("passport");
const PORT = process.env.serverPort;
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(helmet());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.get("/", (req: Request, res: Response) => {
  res.send({ Yay: "you are authenticated" });
});

const client = connectRedis();
console.log(client);
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
