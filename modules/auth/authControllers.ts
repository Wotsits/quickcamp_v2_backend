import { NextFunction, Request, Response } from "express";
import { prisma } from "../../index.js";
import { jwtMaxAge } from "../../settings.js";
import bcrypt from "bcryptjs";
import { User } from "../../types.js";
import jwt from "jsonwebtoken";
import { isPasswordOk } from "../../utilities/middleware/userManagement/helpers.js";
import { generateToken } from "./authHelpers.js";
import dotenv from "dotenv";

dotenv.config();
const { REFRESHTOKENSECRET: refreshTokenSecret } =
  process.env;

const messages = {
  NO_USERNAME_OR_PASSWORD: "Username or password not present",
  LOGIN_NOT_SUCCESSFUL:
    "Login not successful. Credentials did not match a registered user.",
  CREDENTIALS_DID_NOT_MATCH: "Credentials did not match.",
  AN_ERROR_OCCURRED: "An error occurred",
  LOGIN_SUCCESSFUL: "Login successful",
};

export async function login(req: Request, res: Response, next: NextFunction) {
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
                guestTypeGroups: {
                  include: {
                    guestTypes: true,
                  }
                },
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

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
        },
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

export async function token(req: Request, res: Response) {
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
      roles: user.roles,
    } as User);
    res.json({ accessToken });
  });
}

export async function logout(req: Request, res: Response) {
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
}
