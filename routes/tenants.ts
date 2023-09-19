import { Express, Request, Response } from "express";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { getOneById } from "../dataFetchers/getOneById.js";
import { PrismaClient } from "@prisma/client";
import { getAll } from "../dataFetchers/getAll.js";

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