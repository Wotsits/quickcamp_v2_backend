import {Express, Request, Response} from "express";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { getAll } from "../dataFetchers/getAll.js";
import { getOneById } from "../dataFetchers/getOneById.js";

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