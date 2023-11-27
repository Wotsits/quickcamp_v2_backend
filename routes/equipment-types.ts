import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerEquipmentTypeRoutes(app: Express, prisma: PrismaClient) {
  app.get(
    `${urls.EQUIPMENT_TYPES}`,
    loggedIn,
    async (req: Request, res: Response) => {
      
      if (!req.user) {
        res.status(401).json({ message: "Not logged in." });
        return;
      }

      let includeSite = false;

      if (req.query.includeSite) {
        includeSite = req.query.includeSite === "true";
      }

      const tenantId = req.user.tenantId;

      if (!tenantId) {
        res.status(401).json({ message: "Not logged in." });
        return;
      }

      const { siteId } = req.query;

      // if siteId is not provided, return all equipment-types for the tenant.
      if (!siteId) {
        const data = await prisma.equipmentType.findMany({
          where: {
            site: {
              tenantId: tenantId,
            },
          },
        });
        return res.status(200).json(data);
      }
      // if siteId is provided, return all equipment-types for the site.
      else {
        const data = await prisma.equipmentType.findMany({
          where: {
            siteId: parseInt(siteId as string),
          },
        });
        return res.status(200).json(data);
      }
    }
  );
}
