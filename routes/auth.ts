import { PrismaClient } from "@prisma/client";
import { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { jwtMaxAge } from "../settings.js";
import { isPasswordOk } from "../utilities/userManagement/helpers.js";

export function registerLoginRoute(app: Express, prisma: PrismaClient, jwtSecret: string) {
      app.post("/login", async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        // Check if username and password is provided
        if (!email || !password) {
          return res.status(400).json({
            message: "Email or Password not present",
          });
        }
        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) {
            res.status(401).json({
              message: "Login not successful",
              error: "Credentials did not match.",
            });
          } else {
            // comparing given password with hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) res.status(400).json({ message: "Login not succesful" });
            const token = jwt.sign(
              {
                email: email,
                role: user.role
              },
              jwtSecret,
              {
                expiresIn: jwtMaxAge
              }
            )
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: jwtMaxAge * 1000, // in ms
            });
            res.status(200).json({
              message: "Login successful",
              user: user.id,
            });
          }
        } catch (error) {
          res.status(400).json({
            message: "An error occurred",
            error: error,
          });
        }
      });
}

export function registerRegisterRoute(app: Express, prisma: PrismaClient, jwtSecret: string) {
    app.post("/register", async (req: Request, res: Response, next: NextFunction) => {
        const { email, name, password, role } = req.body;
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
                email,
                name,
                password: hash,
                role,
                tenantId: 0, // TODO replace this with the tenantId when you've figured out how to get it.
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
      });
}