import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { middlewareInit } from "./middlewareInit.js";
import { routesInit } from "./routesInit.js";
import { PrismaClient } from "@prisma/client";

// -----------------
// APP SETUP
// -----------------

dotenv.config();
const app = express();

// Instantiate Prisma instance with logging
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

// -----------------
// ENV VARS
// -----------------

const { PORT: port, JWTSECRET: jwtSecret, REFRESHTOKENSECRET: refreshTokenSecret } = process.env;

// -----------------
// MIDDLEWARE SETUP
// -----------------

middlewareInit(app, express);

// ----------------
// ROUTES
// ----------------

if (!jwtSecret || !refreshTokenSecret)
  throw new Error(
    "JWTSecret or RefreshTokenSecret undefined in env.  Define jwtSecret as JWTSECRET={jwtsecret} and refreshTokenSecret as REFRESHTOKENSECRET={refreshTokenSecret} in .env"
  );
routesInit(app, prisma);

// ----------------
// LISTEN
// ----------------

if (!port)
  throw new Error(
    "Listening port undefined by env.  Define listening port as PORT={portNumber} in .env"
  );
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
