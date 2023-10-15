import {Express, Request, Response} from "express";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerSiteRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.SITES, loggedIn, async (req: Request, res: Response) => {
        // return all sites here, paginated.
      });
    
      app.get(
        `${urls.SITES}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return site by id here.
        }
      );
}