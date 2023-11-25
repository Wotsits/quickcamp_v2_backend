import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerGuestTypeRoutes(app: Express, prisma: PrismaClient) {
  app.get(
    `${urls.GUEST_TYPES}`,
    loggedIn,
    async (req: Request, res: Response) => {
      if (!req.user) {
        res.status(401).json({ message: "Not logged in." });
        return;
      }

      const tenantId = req.user.tenantId;

      if (!tenantId) {
        res.status(401).json({ message: "Not logged in." });
        return;
      }

      const { siteId } = req.query;

      // if siteId is not provided, return all guest-types for the tenant.
      if (!siteId) {
        const data = await prisma.guestType.findMany({
          where: {
            site: {
              tenantId: tenantId,
            },
          },
        });
        return res.status(200).json(data);
      }
      // if siteId is provided, return all guest-types for the site.
      else {
        const data = await prisma.guestType.findMany({
          where: {
            siteId: parseInt(siteId as string),
          },
          
        });
        return res.status(200).json(data);
      }
    }
  );
}