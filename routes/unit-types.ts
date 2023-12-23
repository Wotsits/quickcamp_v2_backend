import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../utilities/middleware/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerUnitTypeRoutes(app: Express, prisma: PrismaClient) {
  app.get(
    `${urls.UNIT_TYPES}`,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    async (req: Request, res: Response) => {
      // check if user is logged in
      const { user } = req;
      if (!user) {
        res.status(401).json({ message: "Unauthorized." });
        return;
      }

      const {
        siteId,
        includeSite,
        includeUnits,
        includeRates,
        startDate,
        endDate,
      } = req.query;

      const { tenantId } = user;

      if (!tenantId) {
        res
          .status(401)
          .json({
            message:
              "Tenant id not accessible on user object.  This is a backend issue.",
          });
        return;
      }

      const parsedincludeSite = Boolean(includeSite);
      const parsedincludeUnits = Boolean(includeUnits);
      const parsedincludeRates = Boolean(includeRates);

      // if siteId is not provided, return all unit-types for the tenant.
      if (!siteId) {
        const data = await prisma.unitType.findMany({
          where: {
            site: {
              tenantId: tenantId,
            },
          },
          include: {
            units: parsedincludeUnits,
          },
        });
        return res.status(200).json({ data });
      }

      // if siteId is provided, return all unit-types for the site.
      else {
        if (includeRates && (!startDate || !endDate)) {
          return res
            .status(400)
            .json({
              message:
                "If includeRates is true, startDate and endDate must be provided.",
            });
        }

        const data = await prisma.unitType.findMany({
          where: {
            siteId: parseInt(siteId as string),
          },
          include: {
            units: parsedincludeUnits,
            unitTypeFeesCalendarEntries: parsedincludeRates && {
              where: {
                date: {
                  lte: new Date(endDate as string),
                  gte: new Date(startDate as string),
                },
              },
            },
            guestFeesCalendarEntries: parsedincludeRates && {
              where: {
                date: {
                  lte: new Date(endDate as string),
                  gte: new Date(startDate as string),
                },
              },
              include: {
                guestType: true,
              },
            },
            petFeesCalendarEntries: parsedincludeRates && {
              where: {
                date: {
                  lte: new Date(endDate as string),
                  gte: new Date(startDate as string),
                },
              },
            },
            vehicleFeesCalendarEntries: parsedincludeRates && {
              where: {
                date: {
                  lte: new Date(endDate as string),
                  gte: new Date(startDate as string),
                },
              },
            },
            extraFeesCalendarEntries: parsedincludeRates && {
              where: {
                date: {
                  lte: new Date(endDate as string),
                  gte: new Date(startDate as string),
                },
              },
            },
          },
        });

        return res.status(200).json({ data });
      }
    }
  );

  app.get(
    `${urls.UNITTYPES}/:id`,
    loggedIn,
    async (req: Request, res: Response) => {
      return res.status(501).json({ message: "Not implemented" });
    }
  );
}
