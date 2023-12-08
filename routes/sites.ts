import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/middleware/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerSiteRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.SITES, validateProvidedData, loggedIn, async (req: Request, res: Response) => {
    // confirm that the user is logged in and has a tenantId
    const { user } = req;
    if (!user) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    if (!user.tenantId) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    // get the tenantId from the user
    const { tenantId } = user;

    // get all sites for that tenantId
    const sites = await prisma.site.findMany({
      where: { tenantId },
    });

    // return all sites for that tenantId
    return res.status(200).json({ data: sites });
  });
}
