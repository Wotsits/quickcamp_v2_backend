import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerStatsRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.get(
    urls.STATS + urls.ON_SITE,
    loggedIn,
    hasAccessToRequestedSite,
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const siteId = req.query.siteId as string;

      if (!siteId) {
        return res.status(400).json({
          message:
            "Bad request - invalid parameters.  You must provide a siteId to which you have access.",
        });
      }

      // ensure that siteId is a number
      let parsedSiteId: number;
      try {
        parsedSiteId = parseInt(siteId);
      } catch {
        return res.status(400).json({
          message:
            "Bad request - invalid parameters.  You must provide a siteId to which you have access.",
        });
      }

      const totalOnSite = await prisma.bookingGuest.count({
        where: {
          booking: {
            unit: {
              unitType: {
                siteId: parsedSiteId,
              },
            },
          },
          NOT: {
            checkedIn: null,
          },
          checkedOut: null,
        },
      });

      return res.status(200).json({ data: totalOnSite });
    }
  );
}
