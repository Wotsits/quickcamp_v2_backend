import { Express, Request, Response } from "express";
import { getAll } from "../dataFetchers/getAll";
import { entityTypes, urls } from "../enums";
import { loggedIn } from "../utilities/userManagement/middleware";
import { getOneById } from "../dataFetchers/getOneById";
import { PrismaClient } from "@prisma/client";

export function registerTenantRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.TENANTS, loggedIn, async (req: Request, res: Response) => {
        // return all tenants here, paginated.
        const data = await getAll(entityTypes.TENANT, prisma);
        res.json(data);
      });
    
      app.get(
        `${urls.TENANTS}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return tenant by id here.
          const id = parseInt(req.params.id);
          const data = await getOneById(entityTypes.TENANT, id, prisma);
          res.json(data);
        }
      );
}