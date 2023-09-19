import { Express, Request, Response } from "express";
import { getAll } from "../dataFetchers/getAll";
import { getOneById } from "../dataFetchers/getOneById";
import { entityTypes, urls } from "../enums";
import { loggedIn } from "../utilities/userManagement/middleware";
import { PrismaClient } from "@prisma/client";

export function registerUnitRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.UNITS, loggedIn, async (req: Request, res: Response) => {
    // return all units here, paginated.
    const data = await getAll(entityTypes.UNIT, prisma);
    res.json(data);
  });

  app.get(
    `${urls.UNITS}/:unitTypeId`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return units by unitTypeId here, paginated.
    }
  );

  app.get(
    `${urls.UNITS}/:id`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return unit by id here.
      const id = parseInt(req.params.id);
      const data = await getOneById(entityTypes.UNIT, id, prisma);
      res.json(data);
    }
  );
}
