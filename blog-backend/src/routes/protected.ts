const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require("path");
import { NextFunction, Request, Response } from "express";
import { URL_ORIGIN } from "../../constants";

const verifyAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {

    let token = req.cookies.access_token;
    // console.log("cookies:",req.cookies);
    if (!token) {
      res.status(403).json({ message: "user is not authorized" });
      return res.redirect(URL_ORIGIN + "/login");
    } else {
      const privateKey = fs.readFileSync(
        path.join(__dirname, "../../certificates/server.key"),
      );
      let decodedUser = jwt.verify(token, privateKey, { algorithm: "HS256" });
      req.user = decodedUser;
    }
    next();
  };

export{
    verifyAuthentication
}