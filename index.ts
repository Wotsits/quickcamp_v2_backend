import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { middlewareInit } from "./middlewareInit.js";
import { routesInit } from "./routes/index.js";
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

const { PORT: port, JWTSECRET: jwtSecret } = process.env;

// -----------------
// MIDDLEWARE SETUP
// -----------------

middlewareInit(app, express);

// ----------------
// ROUTES
// ----------------

if (!jwtSecret)
  throw new Error(
    "JWTSecret undefined in env.  Define listening port as JWTSECRET={jwtsecret} in .env"
  );
routesInit(app, prisma, jwtSecret);

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
