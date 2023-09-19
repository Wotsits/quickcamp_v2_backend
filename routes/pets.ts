import { Express, Request, Response } from "express";
import { entityTypes, urls } from "../enums";
import { loggedIn } from "../utilities/userManagement/middleware";
import { getAll } from "../dataFetchers/getAll";
import { PrismaClient } from "@prisma/client";
import { getOneById } from "../dataFetchers/getOneById";

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
