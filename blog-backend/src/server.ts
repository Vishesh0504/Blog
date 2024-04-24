const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");
const helmet = require("helmet");
const logger = require("morgan");
import { URL_ORIGIN } from "../constants";
import { verifyAuthentication } from "./protected";
import blogRouter from "./routes/blog/ blog.routes";
import postRouter from "./routes/posts/posts.routes";
const { authRouter } = require("./routes/auth/users.routes");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const passport = require("passport");
const PORT = process.env.serverPort;
const app = express();

app.use(logger("dev"));
// app.options('*', cors())
app.use(cors({ origin: `${URL_ORIGIN}`, credentials: true }));

app.use(helmet());
app.use(cookie_parser());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/blog", verifyAuthentication, blogRouter);
app.use("/post",verifyAuthentication,postRouter);
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
