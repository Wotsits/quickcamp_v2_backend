import { Express, Request, Response } from "express";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { getAll } from "../dataFetchers/getAll.js";
import { PrismaClient } from "@prisma/client";
import { getOneById } from "../dataFetchers/getOneById.js";

export function registerPetRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.PETS, loggedIn, async (req: Request, res: Response) => {
    // return all pets here, paginated.
    const data = await getAll(entityTypes.PET, prisma);
    res.json(data);
  });

  app.get(`${urls.PETS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return pet by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.PET, id, prisma);
    res.json(data);
  });
}
