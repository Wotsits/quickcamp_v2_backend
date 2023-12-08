import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../utilities/middleware/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { UserResponse } from "../types.js";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerEquipmentTypeRoutes(
  app: Express,
  prisma: PrismaClient
) {
  app.get(
    `${urls.EQUIPMENT_TYPES}`,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    async (req: Request, res: Response) => {

      // check if user is logged in
      const {user} = req;
      if (!user) {
        res.status(401).json({ message: "Unauthorized." });
        return;
      }

      let includeSite = false;

      if (req.query.includeSite) {
        includeSite = req.query.includeSite === "true";
      }

      const { tenantId } = user;

      if (!tenantId) {
        res.status(401).json({ message: "Tenant id not accessible on user object.  This is a backend issue." });
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
          include: {
            site: includeSite,
          },
        });
        return res.status(200).json({ data });
      }
      // if siteId is provided, return all equipment-types for the site.
      else {
        const data = await prisma.equipmentType.findMany({
          where: {
            siteId: parseInt(siteId as string),
          },
          include: {
            site: includeSite,
          },
        });
        return res.status(200).json({ data });
      }
    }
  );
}
