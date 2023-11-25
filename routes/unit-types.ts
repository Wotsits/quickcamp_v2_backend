import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerUnitTypeRoutes(app: Express, prisma: PrismaClient) {
  app.get(
    `${urls.UNIT_TYPES}`,
    loggedIn,
    async (req: Request, res: Response) => {
      if (!req.user) {
        res.status(401).json({ message: "Not logged in." });
        return;
      }

      let includeUnits = false;
      let includeSite = false;

      if (req.query.includeUnits) {
        includeUnits = req.query.includeUnits === "true";
      }
      if (req.query.includeSite) {
        includeSite = req.query.includeSite === "true";
      }

      const tenantId = req.user.tenantId;

      if (!tenantId) {
        res.status(401).json({ message: "Not logged in." });
        return;
      }

      const { siteId } = req.query;

      // if siteId is not provided, return all unit-types for the tenant.
      if (!siteId) {
        const data = await prisma.unitType.findMany({
          where: {
            site: {
              tenantId: tenantId,
            },
          },
          include: {
            units: includeUnits,
          },
        });
        return res.status(200).json(data);
      }
      // if siteId is provided, return all unit-types for the site.
      else {
        const data = await prisma.unitType.findMany({
          where: {
            siteId: parseInt(siteId as string),
          },
          include: {
            units: includeUnits,
          },
        });
        return res.status(200).json(data);
      }
    }
  );

  app.get(
    `${urls.UNITTYPES}/:id`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return unit-type by id here.
    }
  );
}
