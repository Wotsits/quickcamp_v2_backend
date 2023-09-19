import {Express, Request, Response} from "express";
import { entityTypes, urls } from "../enums";
import { loggedIn } from "../utilities/userManagement/middleware";
import { PrismaClient } from "@prisma/client";
import { getAll } from "../dataFetchers/getAll";
import { getOneById } from "../dataFetchers/getOneById";

export function registerSiteRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.SITES, loggedIn, async (req: Request, res: Response) => {
        // return all sites here, paginated.
        const data = await getAll(entityTypes.SITE, prisma);
        res.json(data);
      });
    
      app.get(
        `${urls.SITES}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return site by id here.
          const id = parseInt(req.params.id);
          const data = getOneById(entityTypes.SITE, id, prisma);
          res.json(data);
        }
      );
}