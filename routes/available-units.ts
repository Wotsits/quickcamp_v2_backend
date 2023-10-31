import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerUnitRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.AVAILABLE_UNITS, loggedIn, async (req: Request, res: Response) => {
    // check that the user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { tenantId } = req.user;

    // extract the startDate and endDate from the request query
    const { startDate, endDate, siteId, equipmentTypeId } = req.query;

    // check that the startDate and endDate are present
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    // convert the startDate and endDate to Date objects
    let startDateObj: Date;
    let endDateObj: Date;

    try {
      startDateObj = new Date(startDate as string);
      endDateObj = new Date(endDate as string);
    } catch (e) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    // check that the startDate is before the endDate
    if (startDateObj > endDateObj) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const data = await prisma.unit.findMany({
      where: {
        unitType: {
          site: {
            id: parseInt(siteId as string),
            tenantId: tenantId,
          },
          equipmentTypes: {
            some: {
              id: parseInt(equipmentTypeId as string),
            },
          },
        },
        calendarEntries: {
          none: {
            AND: {
              date: {
                lte: endDateObj,
                gte: startDateObj,
              },
              bookingId: {
                not: null,
              }
            },
          },
        },
      },
    });

    res.json(data);
  });
}
