import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const { JWTSECRET: jwtSecret } = process.env;

export function loggedIn(req: Request, res: Response, next: NextFunction) {
  if (!jwtSecret)
    throw new Error(
      "JWTSecret undefined in env.  Define listening port as JWTSECRET={jwtsecret} in .env"
    );
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  if (!jwtSecret)
    throw new Error(
      "JWTSecret undefined in env.  Define listening port as JWTSECRET={jwtsecret} in .env"
    );
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "ADMIN") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
}

export function userAuth(req: Request, res: Response, next: NextFunction) {
  if (!jwtSecret)
    throw new Error(
      "JWTSecret undefined in env.  Define listening port as JWTSECRET={jwtsecret} in .env"
    );
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "BASIC") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
}
