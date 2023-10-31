import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import {
  BookingGuest,
  BookingPet,
  BookingVehicle,
  PrismaClient,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { raiseConsoleErrorWithListOfMissingData } from "../utilities/raiseErrorWithListOfMissingData.js";
import { bookingPaymentsTotal } from "../utilities/bookingPaymentsTotal.js";

export function registerBookingRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.get(
    urls.BOOKINGS_BY_SITE,
    loggedIn,
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const siteId = req.query.siteId;

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
          unit: {
            unitType: {
              siteId: parseInt(siteId as string),
            },
          },
        },
        include: {
          unit: true,
          leadGuest: true,
          guests: true,
          pets: true,
          vehicles: true,
          payments: true,
        },
      });
    }
  );

  // ****************************************************

  app.get(
    urls.BOOKINGS_BY_SITE_AND_DATE_RANGE,
    loggedIn,
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const { start, end, siteId } = req.query;

      if (!siteId) {
        return res.status(400).json({
          message: "Bad request - no siteId",
        });
      }

      if (!start || !end) {
        return res.status(400).json({
          message: "Bad request - no start or end date",
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

      // return bookings by date range here, paginated.
      const data = await prisma.booking.findMany({
        where: {
          AND: [
            {
              unit: {
                unitType: {
                  siteId: parseInt(siteId as string),
                },
              },
            },
            {
              OR: [
                {
                  start: {
                    gte: new Date(start as string),
                    lt: new Date(end as string),
                  },
                },
                {
                  end: {
                    gte: new Date(start as string),
                    lt: new Date(end as string),
                  },
                },
                {
                  AND: [
                    {
                      start: {
                        lte: new Date(start as string),
                      },
                      end: {
                        gt: new Date(end as string),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        include: {
          unit: true,
          leadGuest: true,
          guests: {
            select: {
              checkedIn: true,
              guestType: {
                select: {
                  name: true,
                },
              },
            }
          },
          pets: true,
          vehicles: true,
          payments: true,
        },
      });

      // convert to summary for transmission
      const bookingSummaries = data.map((booking) => ({
        id: booking.id,
        bookingName: booking.leadGuest.lastName,
        guests: booking.guests.reduce(
          (acc: { [key: string]: number }, guest) => {
            if (acc[guest.guestType.name]) {
              acc[guest.guestType.name] += 1;
              return acc;
            } else {
              acc[guest.guestType.name] = 1;
              return acc;
            }
          },
          {}
        ),
        pets: booking.pets!.length,
        vehicles: booking.vehicles!.length,
        unit: booking.unitId,
        start: booking.start.toString(),
        end: booking.end.toString(),
        paid: bookingPaymentsTotal(booking.payments) >= booking.totalFee,
        peopleCheckedIn: booking.guests.filter((guest) => guest.checkedIn)
          .length,
        petsCheckedIn: booking.pets.filter((pet) => pet.checkedIn).length,
        vehiclesCheckedIn: booking.vehicles.filter(
          (vehicle) => vehicle.checkedIn
        ).length,
      }));

      return res.json(bookingSummaries);
    }
  );

  // ****************************************************

  app.get(
    `${urls.BOOKING_BY_ID}`,
    loggedIn,
    async (req: Request, res: Response) => {
      // ensure we have the user on the request
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const bookingId = req.query.id;

      // get the user's tenancy
      const tenantId = user?.tenantId;

      // get the booking
      const data = await prisma.booking.findUnique({
        where: {
          id: parseInt(bookingId as string),
        },
        include: {
          unit: {
            include: {
              unitType: {
                include: {
                  site: {
                    include: {
                      tenant: true,
                    },
                  },
                },
              },
            },
          },
          leadGuest: true,
          guests: true,
          pets: true,
          vehicles: true,
          payments: true,
        },
      });

      // ensure the booking exists
      if (!data) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // ensure the user is allowed to access the booking
      if (data.unit.unitType.site.tenantId !== tenantId) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // return the booking
      return res.json(data);
    }
  );

  // ****************************************************

  app.post(urls.NEW_BOOKING, loggedIn, async (req: Request, res: Response) => {
    const {
      siteId,
      leadGuestId,
      leadGuestFirstName,
      leadGuestLastName,
      leadGuestEmail,
      leadGuestTel,
      leadGuestAddress1,
      leadGuestAddress2,
      leadGuestCity,
      leadGuestCounty,
      leadGuestPostcode,
      leadGuestCountry,
      equipmentTypeId,
      unitId,
      startDate,
      endDate,
      extras,
      bookingGuests,
      bookingPets,
      bookingVehicles,
      paymentAmount,
      paymentMethod,
      paymentDate,
    } = req.body;

    if (
      !siteId ||
      !equipmentTypeId ||
      !unitId ||
      !startDate ||
      !endDate ||
      !extras ||
      !bookingGuests ||
      !bookingPets ||
      !bookingVehicles ||
      !paymentAmount ||
      !paymentMethod ||
      !paymentDate
    ) {
      const requiredData = {
        siteId,
        equipmentTypeId,
        unitId,
        startDate,
        endDate,
        extras,
        bookingGuests,
        bookingPets,
        bookingVehicles,
        paymentAmount,
        paymentMethod,
        paymentDate,
      };
      raiseConsoleErrorWithListOfMissingData(requiredData);
      return res.status(400).json({
        message: "Bad request - missing data",
      });
    }

    const path: "NEWGUEST" | "EXISTINGGUEST" =
      leadGuestId !== undefined && leadGuestId !== null
        ? "EXISTINGGUEST"
        : "NEWGUEST";

    // ensure we have the user on the request
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ensure that we have all the required data for the site
    if (siteId === undefined || siteId === null) {
      return res.status(400).json({
        message: "Bad request - no siteId",
      });
    }

    // ensure that we have all the required data for the lead guest
    if (
      path === "NEWGUEST" &&
      (!leadGuestLastName ||
        !leadGuestEmail ||
        !leadGuestAddress1 ||
        !leadGuestPostcode)
    ) {
      return res.status(400).json({
        message: "Bad request - no leadGuestId or leadGuest details",
      });
    }

    // --------------

    // check that the emailAddress does existing in the database already
    if (leadGuestEmail) {
      const existingLeadGuest = await prisma.leadGuest.findFirst({
        where: {
          email: leadGuestEmail,
          tenantId: req.user.tenantId,
        },
      });

      if (existingLeadGuest) {
        return res.status(400).json({
          message: "Bad request - leadGuest email already exists",
        });
      }
    }

    // --------------

    // ensure that we have all the required data for the booking
    if (equipmentTypeId === undefined || equipmentTypeId === null) {
      return res.status(400).json({
        message: "Bad request - no equipmentTypeId",
      });
    }

    if (unitId === undefined || unitId === null) {
      return res.status(400).json({
        message: "Bad request - no unitId",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Bad request - no startDate or endDate",
      });
    }

    // ensure that we have all the required data for the bookingGuests
    if (bookingGuests.length === 0) {
      return res.status(400).json({
        message: "Bad request - no bookingGuests",
      });
    }

    const everyGuestHasName = bookingGuests.every((guest: BookingGuest) => {
      return guest.name !== "";
    });
    const everyGuestHasType = bookingGuests.every((guest: BookingGuest) => {
      return guest.guestTypeId !== -1;
    });
    const everyPetHasName = bookingPets.every((pet: BookingPet) => {
      return pet.name !== "";
    });
    const everyVehicleHasVehicleReg = bookingVehicles.every(
      (vehicle: BookingVehicle) => {
        return vehicle.vehicleReg !== "";
      }
    );

    if (
      !everyGuestHasName ||
      !everyGuestHasType ||
      !everyPetHasName ||
      !everyVehicleHasVehicleReg
    ) {
      return res.status(400).json({
        message:
          "Bad request - some bookingGuests, bookingPets or bookingVehicles are missing data",
      });
    }

    // ensure that the user is allowed to access the siteId
    const site = await prisma.site.findUnique({
      where: {
        id: parseInt(siteId as string),
        tenantId: req.user?.tenantId,
      },
    });

    if (!site) {
      return res.status(404).json({
        message: "Site not found",
      });
    }

    // ensure that the equipmentTypeId is valid
    const equipmentType = await prisma.equipmentType.findUnique({
      where: {
        id: parseInt(equipmentTypeId as string),
      },
    });

    if (!equipmentType) {
      return res.status(404).json({
        message: "Equipment type not found",
      });
    }

    // ensure that the unitId is valid
    const unit = await prisma.unit.findUnique({
      where: {
        id: parseInt(unitId as string),
      },
    });

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found",
      });
    }

    // convert the bookingGuests to BookingGuest objects
    const bookingGuestsMapped = bookingGuests.map((guest: BookingGuest) => {
      return {
        name: guest.name,
        guestTypeId: guest.guestTypeId,
        start: new Date(startDate),
        end: new Date(endDate),
        checkedIn: false,
      };
    });

    // convert the bookingPets to BookingPet objects
    const bookingPetsMapped = bookingPets.map((pet: BookingPet) => {
      return {
        name: pet.name,
        start: new Date(startDate),
        end: new Date(endDate),
        checkedIn: false,
      };
    });

    // convert the bookingVehicles to BookingVehicle objects
    const bookingVehiclesMapped = bookingVehicles.map(
      (vehicle: BookingVehicle) => {
        return {
          vehicleReg: vehicle.vehicleReg,
          start: new Date(startDate),
          end: new Date(endDate),
          checkedIn: false,
        };
      }
    );

    // convert the extras to Extras objects
    const extrasMap = extras.map((extra: any) => {
      return {
        id: extra,
      };
    });

    const applicableCalendarEntries = await prisma.calendar.findMany({
      where: {
        unitId: parseInt(unitId as string),
        date: {
          gte: new Date(startDate),
          lt: new Date(endDate),
        },
      },
    });

    if (applicableCalendarEntries.length === 0) {
      return res.status(400).json({
        message:
          "Bad request - no calendar entries found for this unit and date range.  Something is wrong with the setup.",
      });
    }

    const calendarConnectArr = applicableCalendarEntries.map((entry) => {
      return {
        id: entry.id,
      };
    });

    // the way that the booking is created depends on whether the leadGuestId has been provided
    try {
      if (path === "EXISTINGGUEST") {
        const result = await prisma.booking.create({
          data: {
            start: new Date(startDate),
            end: new Date(endDate),
            unit: {
              connect: {
                id: parseInt(unitId),
              },
            },
            leadGuest: {
              connect: {
                id: parseInt(leadGuestId),
              },
            },
            totalFee: 100, //TODO calculate this
            guests: {
              create: bookingGuestsMapped,
            },
            pets: {
              create: bookingPetsMapped,
            },
            vehicles: {
              create: bookingVehiclesMapped,
            },
            extras: {
              connect: extrasMap,
            },
            payments: {
              create: {
                paymentAmount: paymentAmount,
                paymentMethod: paymentMethod,
                paymentDate: new Date(paymentDate),
              },
            },
            calendarEntries: {
              connect: calendarConnectArr,
            },
          },
          include: {
            leadGuest: true,
          },
        });

        return res.status(201).json({
          data: result,
        });
      }
      if (path === "NEWGUEST") {
        const tempPassword =
          leadGuestPostcode.replace(" ", "") +
          "-" +
          leadGuestTel.replace(" ", "");
        const hash = await bcrypt.hash(tempPassword, 10);

        const result = await prisma.booking.create({
          data: {
            start: new Date(startDate),
            end: new Date(endDate),
            unit: {
              connect: {
                id: parseInt(unitId as string),
              },
            },
            leadGuest: {
              create: {
                firstName: leadGuestFirstName,
                lastName: leadGuestLastName,
                email: leadGuestEmail,
                tel: leadGuestTel,
                address1: leadGuestAddress1,
                address2: leadGuestAddress2,
                townCity: leadGuestCity,
                county: leadGuestCounty,
                postcode: leadGuestPostcode,
                country: leadGuestCountry,
                tenantId: req.user.tenantId,
                password: hash,
              },
            },
            totalFee: 100, // TODO calculate this
            guests: {
              create: bookingGuestsMapped,
            },
            pets: {
              create: bookingPetsMapped,
            },
            vehicles: {
              create: bookingVehiclesMapped,
            },
            extras: {
              connect: extrasMap,
            },
            payments: {
              create: {
                paymentAmount: paymentAmount,
                paymentMethod: paymentMethod,
                paymentDate: new Date(paymentDate),
              },
            },
            calendarEntries: {
              connect: calendarConnectArr,
            },
          },
          include: {
            leadGuest: true,
          },
        });
        return res.status(201).json({
          data: result,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  });
}
