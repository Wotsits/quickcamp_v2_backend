import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/middleware/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerTenantRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.TENANTS, validateProvidedData, loggedIn, async (req: Request, res: Response) => {
    // return all tenants here, paginated.
    return res.status(501).json({ message: "Not implemented" });
  });

  app.get(
    `${urls.TENANTS}/:id`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return tenant by id here.
      return res.status(501).json({ message: "Not implemented" });
    }
  );
}
