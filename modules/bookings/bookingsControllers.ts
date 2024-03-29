import { Request, Response } from "express";
import { prisma } from "../../index.js";
import { raiseConsoleErrorWithListOfMissingData } from "../../utilities/commonHelpers/raiseErrorWithListOfMissingData.js";
import { BookingGuest } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BookingProcessGuest, BookingProcessPet, BookingProcessVehicle } from "../../types";
import { bookingPaymentsTotal, calculateFee } from "./bookingsHelpers.js";

export async function bookingsBySite(req: Request, res: Response) {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { siteId, take, skip } = req.query;

    // ----------------------------
    // VALIDATE THE SUPPLIED DATA
    // ----------------------------

    if (!siteId) {
      return res.status(400).json({
        message: "Bad request - no siteId",
      });
    }
    
    const parsedSiteId = parseInt(siteId as string);
    const parsedTake = parseInt(take as string);
    const parsedSkip = parseInt(skip as string);

    // ----------------------------
    // GET THE BOOKINGS
    // ----------------------------

    // return bookings here, paginated.
    const count = await prisma.booking.count({
      where: {
        unit: {
          unitType: {
            siteId: parsedSiteId,
          },
        },
      },
    });

    const data = await prisma.booking.findMany({
      where: {
        unit: {
          unitType: {
            siteId: parsedSiteId,
          },
        },
      },
      skip: parsedSkip,
      take: parsedTake,
      orderBy: {
        id: "desc",
      },
      include: {
        unit: true,
        leadGuest: true,
        guests: {
          include: {
            guestType: {
              include: {
                guestTypeGroup: true,
              },
            },
          },
        },
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
      unit: booking.unitId,
      start: booking.start.toString(),
      end: booking.end.toString(),
      paid: bookingPaymentsTotal(booking.payments) >= booking.totalFee,
      guestsCheckedIn: booking.guests.filter((guest) => guest.checkedIn)
        .length,
    }));

    // TODO return the booking summaries instead of the full booking
    return res.status(200).json({ data, count });
  }

  export async function bookingsBySiteAndDateRange (req: Request, res: Response) {
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


    // parse the suppled data
    const parsedSiteId = parseInt(siteId as string);
    const parsedStart = new Date(start as string);
    const parsedEnd = new Date(end as string);

    // return bookings by date range here, paginated.
    const data = await prisma.booking.findMany({
      where: {
        AND: [
          {
            unit: {
              unitType: {
                siteId: parsedSiteId,
              },
            },
          },
          {
            OR: [
              {
                start: {
                  gte: parsedStart,
                  lt: parsedEnd,
                },
              },
              {
                end: {
                  gte: parsedStart,
                  lt: parsedEnd,
                },
              },
              {
                AND: [
                  {
                    start: {
                      lte: parsedStart,
                    },
                    end: {
                      gt: parsedEnd,
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
              include: {
                guestTypeGroup: true,
              },
            },
          },
        },

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
      unit: booking.unitId,
      start: booking.start.toString(),
      end: booking.end.toString(),
      paid: bookingPaymentsTotal(booking.payments) >= booking.totalFee,
      guestsCheckedIn: booking.guests.filter((guest) => guest.checkedIn)
        .length,
    }));

    return res.status(200).json({ data: bookingSummaries });
  }

  export async function bookingById (req: Request, res: Response) {
    // ensure we have the user on the request
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id: bookingId } = req.query;

    // get the user's tenancy
    const { tenantId } = user;

    // parse supplied data
    const parsedBookingId = parseInt(bookingId as string);

    // get the booking
    const data = await prisma.booking.findUnique({
      where: {
        id: parsedBookingId,
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
        guests: {
          include: {
            guestType: {
              include: {
                guestTypeGroup: true,
              },
            }
          },
        },
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
    return res.status(200).json({ data: data });
  }

  export async function createBooking(req: Request, res: Response) {
    const {
      siteId,
      leadGuestId,
      firstName,
      lastName,
      email,
      tel,
      address1,
      address2,
      townCity,
      county,
      postcode,
      country,
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
      (!lastName ||
        !email ||
        !address1 ||
        !postcode)
    ) {
      return res.status(400).json({
        message: "Bad request - no leadGuestId or leadGuest details",
      });
    }

    // --------------

    // check that the emailAddress does existing in the database already
    if (email) {
      const existingLeadGuest = await prisma.leadGuest.findFirst({
        where: {
          email: email,
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

    if (
      !everyGuestHasName
    ) {
      return res.status(400).json({
        message:
          "Bad request - some bookingGuests, bookingPets or bookingVehicles are missing data",
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
        start: guest.start,
        end: guest.end,
        checkedIn: null,
      };
    });

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
            totalFee: await calculateFee(
              unit.unitTypeId,
              new Date(startDate),
              new Date(endDate),
              extras,
              bookingGuests,
              bookingPets,
              bookingVehicles,
              prisma
            ),
            guests: {
              create: bookingGuestsMapped,
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
            status: "CONFIRMED",
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
          postcode.replace(" ", "") +
          "-" +
          tel.replace(" ", "");
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
                firstName,
                lastName,
                email,
                tel,
                address1,
                address2,
                townCity,
                county,
                postcode,
                country,
                tenantId: req.user.tenantId,
                password: hash,
              },
            },
            totalFee: await calculateFee(
              unit.unitTypeId,
              new Date(startDate),
              new Date(endDate),
              extras,
              bookingGuests,
              bookingPets,
              bookingVehicles,
              prisma
            ),
            guests: {
              create: bookingGuestsMapped,
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
            status: "CONFIRMED",
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
  }

  export async function updateBookingLeadGuestExisting(req: Request, res: Response) {
    // ensure that the user is logged in - belt and braces
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // destructure the request body
    const { bookingId, leadGuestId } = req.body;

    // ensure that we have all the required data
    if (!bookingId || !leadGuestId) {
      return res.status(400).json({
        message: "Bad request - missing data",
      });
    }

    // parse the supplied data
    let parsedBookingId = parseInt(bookingId);
    let parsedLeadGuestId = parseInt(leadGuestId);

    // ensure that the booking exists
    const booking = await prisma.booking.findUnique({
      where: {
        id: parsedBookingId,
      },
      include: {
        leadGuest: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // ensure that the leadGuest exists
    const leadGuest = await prisma.leadGuest.findUnique({
      where: {
        id: parsedLeadGuestId,
      },
    });

    if (!leadGuest) {
      return res.status(404).json({
        message: "Lead guest not found",
      });
    }

    // ensure that the booking belongs to user's tenancy
    if (booking.leadGuest.tenantId !== req.user.tenantId) {
      return res.status(403).json({
        message: "Lead guest not found",
      });
    }

    // ensure that the leadGuest belongs to the user's tenancy
    if (leadGuest.tenantId !== req.user.tenantId) {
      return res.status(403).json({
        message: "Lead guest not found",
      });
    }

    // update the booking
    const updatedBooking = await prisma.booking.update({
      where: {
        id: parsedBookingId,
      },
      data: {
        leadGuest: {
          connect: {
            id: parsedLeadGuestId,
          },
        },
      },
      include: {
        leadGuest: true,
      },
    });

    return res.status(200).json({ data: updatedBooking });
  }

  export async function updateBookingLeadGuestNew(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // destructure the request body
    const {
      bookingId,
      firstName,
      lastName,
      email,
      tel,
      address1,
      address2,
      townCity,
      county,
      postcode,
      country,
    } = req.body;

    // ensure that we have all the required data
    if (
      !bookingId ||
      !firstName ||
      !lastName ||
      !email ||
      !tel ||
      !address1 ||
      !postcode
    ) {
      return res.status(400).json({
        message: "Bad request - missing data",
      });
    }

    // ensure that the bookingId is a number
    let parsedBookingId: number;
    try {
      parsedBookingId = parseInt(bookingId);
    } catch {
      return res.status(400).json({
        message: "Bad request - invalid bookingId",
      });
    }

    // ensure that the booking exists
    const booking = await prisma.booking.findUnique({
      where: {
        id: parsedBookingId,
      },
      include: {
        leadGuest: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // ensure that the booking belongs to user's tenancy
    if (booking.leadGuest.tenantId !== req.user.tenantId) {
      return res.status(403).json({
        message: "Lead guest not found",
      });
    }

    // check that the emailAddress does existing in the database already
    const existingLeadGuest = await prisma.leadGuest.findFirst({
      where: {
        email: email,
        tenantId: req.user.tenantId,
      },
    });

    if (existingLeadGuest) {
      return res.status(400).json({
        message: "Bad request - leadGuest email already exists",
      });
    }

    // update the booking

    let hash = "";
    try {
      const tempPassword =
        postcode.replace(" ", "") + "-" + tel.replace(" ", "");
      hash = await bcrypt.hash(tempPassword, 10);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }

    try {
      const updatedBooking = await prisma.booking.update({
        where: {
          id: parsedBookingId,
        },
        data: {
          leadGuest: {
            create: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              tel: tel,
              address1: address1,
              address2: address2,
              townCity: townCity,
              county: county,
              postcode: postcode,
              country: country,
              tenantId: req.user.tenantId,
              password: hash,
            },
          },
        },
        include: {
          leadGuest: true,
        },
      });

      return res.status(200).json({ data: updatedBooking });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
    }

    export async function generateFeeCalcs (req: Request, res: Response) {
        const { user } = req;
        if (!user) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
    
        const unitTypeId = req.query.unitTypeId as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;
        const extras = req.query.extras as string[];
        const bookingGuests = req.query.bookingGuests as unknown as BookingProcessGuest[];
        const bookingPets = req.query.bookingPets as unknown as BookingProcessPet[];
        const bookingVehicles = req.query.bookingVehicles as unknown as BookingProcessVehicle[];
    
        let parsedUnitTypeId = parseInt(unitTypeId);
        let parsedStartDate = new Date(startDate);
        let parsedEndDate = new Date(endDate);
        let parsedExtras = extras ? extras.map((extra) => parseInt(extra as unknown as string)) : [];
    
        const totalFee = await calculateFee(parsedUnitTypeId, parsedStartDate, parsedEndDate, parsedExtras, bookingGuests, bookingPets, bookingVehicles, prisma);
    
        return res.json({ data: { status: "SUCCESS", message: "Fee calculated", totalFee: totalFee } } );
      };