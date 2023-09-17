import { PrismaClient } from "@prisma/client";
import { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtMaxAge } from "../settings.js";
import { isPasswordOk } from "../utilities/userManagement/helpers.js";

const messages = {
  NO_USERNAME_OR_PASSWORD: "Username or password not present",
  LOGIN_NOT_SUCCESSFUL:
    "Login not successful. Credentials did not match a registered user.",
    CREDENTIALS_DID_NOT_MATCH: "Credentials did not match.",
  AN_ERROR_OCCURRED: "An error occurred",
  LOGIN_SUCCESSFUL: "Login successful",
};

export function registerLoginRoute(
  app: Express,
  prisma: PrismaClient,
  jwtSecret: string
) {
  app.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;
      // Check if username and password is provided
      if (!username || !password) {
        return res.status(400).json({
          message: messages.NO_USERNAME_OR_PASSWORD,
        });
      }
      try {
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (!user) {
          return res.status(401).json({
            message:
              messages.LOGIN_NOT_SUCCESSFUL,
            error: messages.CREDENTIALS_DID_NOT_MATCH,
          });
        } else {
          // comparing given password with hashed password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return res
              .status(401)
              .json({
                message:
                  messages.LOGIN_NOT_SUCCESSFUL,
                error: messages.CREDENTIALS_DID_NOT_MATCH,
              });
          const token = jwt.sign(
            {
              username: username,
              role: user.role,
              tenant: user.tenantId,
            },
            jwtSecret,
            {
              expiresIn: jwtMaxAge,
            }
          );
          return res
            .cookie("jwt", token, {
              httpOnly: true,
              maxAge: jwtMaxAge * 1000, // in ms
            })
            .status(200)
            .json({
              message: messages.LOGIN_SUCCESSFUL,
              user: user.id,
            });
        }
      } catch (error) {
        return res.status(400).json({
          message: messages.AN_ERROR_OCCURRED,
          error: error,
        });
      }
    }
  );
}

export function registerRegisterRoute(
  app: Express,
  prisma: PrismaClient
) {
  app.post(
    "/register",
    async (req: Request, res: Response, next: NextFunction) => {
      const { username, name, password, role, email } = req.body;
      // TODO: how do I get the tenant making the new user?
      if (!isPasswordOk(password)) {
        return res
          .status(400)
          .json({ message: "Password does not meet minimum requirements" });
      }
      try {
        const hash = await bcrypt.hash(password, 10);
        await prisma.user
          .create({
            data: {
              username,
              name,
              password: hash,
              role,
              tenantId: 0, // TODO replace this with the tenantId when you've figured out how to get it.
              email,
            },
          })
          .then((user) =>
            res.status(200).json({
              message: "User successfully created",
              user,
            })
          );
      } catch (err) {
        res.status(401).json({
          message: "User not successful created",
          error: err,
        });
      }
    }
  );
}
