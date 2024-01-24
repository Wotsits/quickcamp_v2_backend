import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { routesInit } from "./routesInit.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import cookieParser from "cookie-parser";

// -----------------
// APP SETUP
// -----------------

dotenv.config();
const app = express();

// Instantiate Prisma instance with logging
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

// Get env vars
const { PORT: port, JWTSECRET: jwtSecret, REFRESHTOKENSECRET: refreshTokenSecret } = process.env;

if (!jwtSecret || !refreshTokenSecret)
  throw new Error(
    "JWTSecret or RefreshTokenSecret undefined in env.  Define jwtSecret as JWTSECRET={jwtsecret} and refreshTokenSecret as REFRESHTOKENSECRET={refreshTokenSecret} in .env"
  );

// -----------------
// MIDDLEWARE SETUP
// -----------------

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------------
// ROUTES
// ----------------

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
