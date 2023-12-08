import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../utilities/middleware/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerStatsRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.get(
    urls.STATS + urls.ON_SITE,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    async (req: Request, res: Response) => {
      const { user } = req;
      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const { siteId } = req.query;

      if (!siteId) {
        return res.status(400).json({
          message:
            "Bad request - invalid parameters.  You must provide a siteId to which you have access.",
        });
      }

      // parse the siteId
      const parsedSiteId = parseInt(siteId as string);

      // get the total number of guests on site
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

      return res.status(200).json({ data: { totalOnSite } });
    }
  );
}
