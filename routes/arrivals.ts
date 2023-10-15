import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import {
  PrismaClient,
} from "@prisma/client";

export function registerArrivalsRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.get(
    urls.ARRIVALS_BY_DATE,
    loggedIn,
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const siteId = req.query.siteId;
      const date = req.query.date;

      if (!siteId) {
        return res.status(400).json({
          message: "Bad request - no siteId",
        });
      }

      // check that user is allowed to access this siteId
      const siteIdInt = parseInt(siteId as string);

      const user = req.user;
      const userSites = user.sites;
      const targetSite = userSites.find((site) => site.id === siteIdInt);

      if (!targetSite) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // return bookings here, paginated.
      const data = await prisma.booking.findMany({
        where: {
          OR: [
            {
              guests: {
                some: {
                  start: new Date(date as string),
                },
              },
            },
            {
              pets: {
                some: {
                  start: new Date(date as string),
                },
              },
            },
            {
              vehicles: {
                some: {
                  start: new Date(date as string),
                },
              },
            },
          ],
        },
        orderBy: [
          {
            leadGuest: {
              lastName: "asc",
            },
          },
          {
            leadGuest: {
              firstName: "asc",
            },
          }
        ],
        include: {
          unit: true,
          leadGuest: true,
          guests: true,
          pets: true,
          vehicles: true,
          payments: true,
        },
      });

      return res.json(data);
    }
  );
}
