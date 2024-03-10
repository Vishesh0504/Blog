const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");
const helmet = require("helmet");
const logger = require("morgan");
import { verifyAuthentication } from "./routes/protected";
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

app.get('/',verifyAuthentication,()=>{console.log("hi")})
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
