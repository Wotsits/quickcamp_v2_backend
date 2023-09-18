import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ----------------

dotenv.config();
const { JWTSECRET: jwtSecret } = process.env;

// ----------------

const errorMessages = {
  JWTSECRET_NOT_DEFINED:
    "JWTSecret undefined in env.  Define JWTSecret as JWTSECRET={jwtsecret} in .env",
  NOT_AUTHORIZED: "Not authorized",
  NOT_AUTHORIZED_TOKEN_NOT_AVAILABLE: "Not authorized, token not available",
};

// ----------------

export function loggedIn(req: Request, res: Response, next: NextFunction) {
  if (!jwtSecret) throw new Error(errorMessages.JWTSECRET_NOT_DEFINED);

  // Get the auth header and token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token, return error
  if (!token) {
    console.log("JWT VERIFICATION FAILED - NO JWT TOKEN IN PAYLOAD");
    return res
      .status(401)
      .json({ message: errorMessages.NOT_AUTHORIZED_TOKEN_NOT_AVAILABLE });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
    if (err) {
      console.log("JWT VERIFICATION FAILED - INVALID JWT TOKEN");
      return res.status(403).json({ message: errorMessages.NOT_AUTHORIZED });
    }
    req.user = decodedToken;
    console.log(decodedToken)
    next();
  });
}

// ----------------

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  if (!jwtSecret) throw new Error(errorMessages.JWTSECRET_NOT_DEFINED);
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: errorMessages.NOT_AUTHORIZED });
      } else {
        if (decodedToken.role !== "ADMIN") {
          return res
            .status(401)
            .json({ message: errorMessages.NOT_AUTHORIZED });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: errorMessages.NOT_AUTHORIZED_TOKEN_NOT_AVAILABLE });
  }
}

// ----------------

export function userAuth(req: Request, res: Response, next: NextFunction) {
  if (!jwtSecret) throw new Error(errorMessages.JWTSECRET_NOT_DEFINED);
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: errorMessages.NOT_AUTHORIZED });
      } else {
        if (decodedToken.role !== "BASIC") {
          return res
            .status(401)
            .json({ message: errorMessages.NOT_AUTHORIZED });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: errorMessages.NOT_AUTHORIZED_TOKEN_NOT_AVAILABLE });
  }
}
