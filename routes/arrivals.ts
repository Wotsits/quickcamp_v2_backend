import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import {
  Booking,
  BookingGuest,
  BookingPet,
  BookingVehicle,
  PrismaClient,
} from "@prisma/client";
import { raiseConsoleErrorWithListOfMissingData } from "../utilities/raiseErrorWithListOfMissingData.js";

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
          },
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

export function registerCheckInRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.post(
    urls.CHECK_IN_GUEST,
    loggedIn,
    async (req: Request, res: Response) => {
      // unpack the request body
      const { id, type } = req.body;

      // check that the required data is present
      if (!id || !type) {
        const requiredData = {
          id,
          type,
        };
        raiseConsoleErrorWithListOfMissingData(requiredData);
        return res.status(400).json({
          message: "Bad request - missing id or type",
        });
      }

      // check that the type is valid
      if (type !== "GUEST" && type !== "PET" && type !== "VEHICLE") {
        return res.status(400).json({
          message: "Bad request - invalid type",
        });
      }

      // check that the user is logged in
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      let thing = null;

      const reusableWhereAndIncludeBlock = {
        where: {
          id: id,
        },
        include: {
          booking: {
            include: {
              unit: {
                include: {
                  unitType: {
                    include: {
                      site: true,
                    },
                  },
                },
              },
            },
          },
        },
      };

      if (type === "GUEST")
        thing = await prisma.bookingGuest.findUnique(
          reusableWhereAndIncludeBlock
        );
      if (type === "PET")
        thing = await prisma.bookingPet.findUnique(
          reusableWhereAndIncludeBlock
        );
      if (type === "VEHICLE")
        thing = await prisma.bookingVehicle.findUnique(
          reusableWhereAndIncludeBlock
        );

      // check that the guest exists
      if (!thing || thing === null) {
        return res.status(404).json({
          message: "Not found",
        });
      }

      // check that the user has access to the siteId for which the guest is being checked in
      const userSites = user.sites;
      const targetSite = userSites.find(
        (site) => site.id === thing!.booking.unit.unitType.site.id
      );

      if (!targetSite) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // check that the guest is not already checked in
      if (thing.checkedIn) {
        return res.status(400).json({
          message: "Bad request - guest already checked in",
        });
      }

      // check that the guest is not already checked out
      if (thing.checkedOut) {
        return res.status(400).json({
          message: "Bad request - guest already checked out",
        });
      }

      // check that the booking is not cancelled
      if (thing.booking.status !== "CONFIRMED") {
        return res.status(400).json({
          message: "Bad request - booking cancelled",
        });
      }

      let updatedThing;
      if (type === "GUEST") {
        // check the guest in
        updatedThing = await prisma.bookingGuest.update({
          where: {
            id: id,
          },
          data: {
            checkedIn: new Date(),
          },
        });
      }

      if (type === "PET") {
        // check the pet in
        updatedThing = await prisma.bookingPet.update({
          where: {
            id: id,
          },
          data: {
            checkedIn: new Date(),
          },
        });
      }

      if (type === "VEHICLE") {
        // check the vehicle in
        updatedThing = await prisma.bookingVehicle.update({
          where: {
            id: id,
          },
          data: {
            checkedIn: new Date(),
          },
        });
      }

      res.json(updatedThing);
    }
  );
}
