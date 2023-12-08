import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtMaxAge } from "../settings.js";
import { isPasswordOk } from "../utilities/middleware/userManagement/helpers.js";
import { User } from "../types.js";
import { loggedIn } from "../utilities/middleware/userManagement/middleware.js";

// ----------------

dotenv.config();
const { JWTSECRET: jwtSecret, REFRESHTOKENSECRET: refreshTokenSecret } =
  process.env;

// ----------------

const messages = {
  NO_USERNAME_OR_PASSWORD: "Username or password not present",
  LOGIN_NOT_SUCCESSFUL:
    "Login not successful. Credentials did not match a registered user.",
  CREDENTIALS_DID_NOT_MATCH: "Credentials did not match.",
  AN_ERROR_OCCURRED: "An error occurred",
  LOGIN_SUCCESSFUL: "Login successful",
};

// ----------------
// HELPER FUNCTIONS
// ----------------

function generateToken(
  user:  User,
  options?: any
) {
  if (!jwtSecret) throw new Error("JWTSecret undefined in env.  Define JWTSecret as JWTSECRET={jwtsecret} in .env");
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      tenantId: user.tenantId,
      roles: user.roles,
      sites: user.tenant.sites,
    },
    jwtSecret,
    options
  );
}

// ----------------

export function registerLoginRoute(app: Express, prisma: PrismaClient) {
  app.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      // ----------------
      // AUTHENTICATE USER CREDENTIALS

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
          include: {
            tenant: {
              include: {
                sites: {
                  include: {
                    guestTypes: true,
                    equipmentTypes: true,
                  },
                },
              },
            },
            roles: true,
          },
        });

        // If user doesn't exist, return error
        if (!user) {
          return res.status(401).json({
            message: messages.LOGIN_NOT_SUCCESSFUL,
            error: messages.CREDENTIALS_DID_NOT_MATCH,
          });
        }

        // compare given password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
          return res.status(401).json({
            message: messages.LOGIN_NOT_SUCCESSFUL,
            error: messages.CREDENTIALS_DID_NOT_MATCH,
          });

        // ----------------
        // JWT TOKEN GENERATION
        // ----------------

        const token = generateToken(user, {
          expiresIn: jwtMaxAge,
        });
        const refreshToken = generateToken(user);

        return res.json({
          message: messages.LOGIN_SUCCESSFUL,
          username: user.username,
          name: user.name,
          tenantId: user.tenantId,
          roles: user.roles,
          sites: user.tenant.sites,
          token,
          refreshToken,
        });

      } catch (error) {
        return res.status(400).json({
          message: messages.AN_ERROR_OCCURRED,
          error: error,
        });
      }
    }
  );
}

export function registerRegisterRoute(app: Express, prisma: PrismaClient) {
  app.post(
    "/register", loggedIn,
    async (req: Request, res: Response, next: NextFunction) => {
      const { username, name, password, role, email } = req.body;
      const tenantId = req.user!.tenantId;
      if (!isPasswordOk(password)) {
        return res
          .status(400)
          .json({ message: "Password does not meet minimum requirements" });
      }
      try {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            username,
            name,
            password: hash,
            tenantId: tenantId,
            email,
            roles: {
              create: {
                role,
              },
            }
          },
          include: {
            roles: true,
            tenant: true,
          },
        });
        return res.status(200).json({
          message: "User successfully created",
          user: user,
        });
      } catch (err) {
        res.status(401).json({
          message: "User not successful created",
          error: err,
        });
      }
    }
  );
}

export function registerTokenRoute(app: Express, prisma: PrismaClient) {
  app.post("/token", async (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokenSecret)
      throw new Error("RefreshTokenSecret not defined in env");
    const data = await prisma.token.findUnique({
      where: {
        id: refreshToken,
      },
    });
    if (!data) return res.sendStatus(403);
    jwt.verify(refreshToken, refreshTokenSecret, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateToken({
        id: user.id,
        username: user.username,
        tenantId: user.tenantId,
        roles: user.roles
      } as User);
      res.json({ accessToken });
    });
  });
}

export function registerLogoutRoute(app: Express, prisma: PrismaClient) {
  app.delete("/logout", async (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokenSecret)
      throw new Error("RefreshTokenSecret not defined in env");
    try {
      await prisma.token.delete({
        where: {
          id: refreshToken,
        },
      });
      res.sendStatus(204);
    } catch {
      res.sendStatus(403);
    }
  });
}
