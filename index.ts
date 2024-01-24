import express from "express";
import dotenv from "dotenv";
import { routesInit } from "./routesInit.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import cookieParser from "cookie-parser";

// -----------------
// APP SETUP
// -----------------

// Get env vars
dotenv.config();

const { PORT: port, JWTSECRET: jwtSecret, REFRESHTOKENSECRET: refreshTokenSecret } = process.env;

if (!jwtSecret || !refreshTokenSecret)
  throw new Error(
    "JWTSecret or RefreshTokenSecret undefined in env.  Define jwtSecret as JWTSECRET={jwtsecret} and refreshTokenSecret as REFRESHTOKENSECRET={refreshTokenSecret} in .env"
  );

// Setup App
export const app = express();
export const router = express.Router();

// Instantiate Prisma instance with logging
export const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });


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

routesInit();

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
