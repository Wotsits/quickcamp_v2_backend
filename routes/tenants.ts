import { Express, Request, Response } from "express";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerTenantRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.TENANTS, loggedIn, async (req: Request, res: Response) => {
        // return all tenants here, paginated.
      });
    
      app.get(
        `${urls.TENANTS}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return tenant by id here.
        }
      );
}