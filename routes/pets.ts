import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerPetRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.PETS, loggedIn, async (req: Request, res: Response) => {
    // return all pets here, paginated.
  });

  app.get(`${urls.PETS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return pet by id here.
  });
}
