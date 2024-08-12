import { Request, Response } from "express";
import { prisma } from "../../index.js";
import { raiseConsoleErrorWithListOfMissingData } from "../../utilities/commonHelpers/raiseErrorWithListOfMissingData.js";
import { BookingGuest } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BookingProcessGuest, BookingProcessPet, BookingProcessVehicle } from "../../types";
import { bookingPaymentsTotal, calculateFee, confirmRequestedDatesAreAvailableForUnit } from "./bookingsHelpers.js";
import { BOOKING_STATUSES } from "../../enums.js";
import { parseObj } from "../../utilities/commonHelpers/parseObj.js";
import { validationRulesMap } from "../../utilities/middleware/validation/validationRules.js";

export async function getBookings(req: Request, res: Response) {

  // booking lists can only be got by users. 
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  let id, start, end, unitId, totalFee, leadGuestId, status, bookingGroupId, siteId, guests, skip, take, include, summariesOnly, count, AND, OR, orderBy;

  // unpack and parse any params into the correct data type using the parseObj helper
  try {
    const {
      id: localId,
      start: localStart,
      end: localEnd,
      unitId: localUnitId,
      totalFee: localTotalFee,
      leadGuestId: localLeadGuestId,
      status: localStatus,
      bookingGroupId: localBookingGroupId,
      siteId: localSiteId,
      guests: localGuests,
      AND: localAND,
      OR: localOR,
      skip: localSkip,
      take: localTake,
      include: localInclude,
      summariesOnly: localSummariesOnly,
      count: localCount,
      orderBy: localOrderBy
    } = parseObj(req.query, validationRulesMap)

    id = localId
    start = localStart
    end = localEnd
    unitId = localUnitId
    totalFee = localTotalFee
    leadGuestId = localLeadGuestId
    status = localStatus
    bookingGroupId = localBookingGroupId
    siteId = localSiteId
    guests = localGuests
    AND = localAND
    OR = localOR
    skip = localSkip
    take = localTake
    include = localInclude,
      summariesOnly = localSummariesOnly,
      count = localCount,
      orderBy = localOrderBy
  }
  catch (err) {
    return res.status(400).json({ message: "malformed query variables" })
  }

  // siteId must be provided for getBookings requests
  // middleware has already checked that user has access to requested site.
  if (!siteId) {
    return res.status(400).json({
      message: "Bad request - no siteId",
    });
  }

  let data;

  try {
    data = await prisma.booking.findMany({
      where: {
        id,
        start,
        end,
        unitId,
        totalFee,
        leadGuestId,
        status,
        bookingGroupId,
        guests,
        unit: {
          unitType: {
            siteId: siteId
          }
        },
        AND,
        OR
      },
      skip,
      take,
      include: {
        leadGuest: include && include.leadGuest,
        unit: include && include.unit,
        payments: include && include.payments,
        guests: include && include.guests,
        extras: include && include.extras,
        calendarEntries: include && include.calendarEntries,
        notes: include && include.notes,
        bookingGroup: include && include.bookingGroup
      },
      orderBy
    })
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }

  // handle summariesOnly request
  let bookingSummaries
  if (summariesOnly) {
    bookingSummaries = data.map((booking) => ({
      id: booking.id,
      bookingName: booking.leadGuest.lastName,
      guests: (booking.guests as any).reduce(
        (acc: { [key: string]: number }, guest: any) => {
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
      bookingGroupId: booking.bookingGroup.id,
      sizeOfGroup: (booking.bookingGroup as any).bookings.length
    }));
  }

  // handle count request
  let countData
  if (count) {
    countData = count && await prisma.booking.count({
      where: {
        unit: {
          unitType: {
            siteId: siteId,
          },
        },
        status: status as string | undefined
      },
    });
  }

  return res.status(200).json({ data: summariesOnly ? bookingSummaries : data, count: countData })
}

export async function getBookingById(req: Request, res: Response) {
  // ensure we have the user on the request
  const { user } = req;
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // get the user's tenancy
  const { tenantId } = user;

  let id;

  // parse supplied data
  try {
    const { id: localId } = parseObj(req.params, validationRulesMap);
    id = localId;
  }
  catch (err) {
    return res.status(400).json({ message: "malformed query variables" })
  }

  // get the booking
  let data;

  try {
    data = await prisma.booking.findUnique({
      where: {
        id
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
        equipmentType: true,
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
        bookingGroup: {
          include: {
            bookings: true
          }
        },
        payments: true,
      },
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }

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
    paymentAmount,
    paymentMethod,
    paymentDate,
    bookingGroupId
  } = req.body;

  if (
    !siteId ||
    !equipmentTypeId ||
    !unitId ||
    !startDate ||
    !endDate ||
    !extras ||
    !bookingGuests ||
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

  // check that the dates are available
  const {applicableCalendarEntries, areAllDatesAvailable} = await confirmRequestedDatesAreAvailableForUnit(prisma, unitId, startDate, endDate);

  if (!areAllDatesAvailable) {
    return res.status(400).json({
      message: "Bad request - some dates are not available",
    });
  }

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

  // decide shape of bookingGroup object
  let bookingGroupObject = {}

  // if no bookingGroupId has been submitted, make one
  if (!bookingGroupId) {
    bookingGroupObject = {
      create: {
        siteId: parseInt(siteId)
      }
    }
  }
  // if a bookingGroupId has been submitted, check we have access to it and if so link this booking to it.
  else {
    const data = prisma.bookingGroup.findFirst({
      where: {
        id: parseInt(bookingGroupId),
        siteId: parseInt(siteId)
      }
    })
    if (!data) {
      return res.status(401).json({
        message: "The bookingGroupId submitted does not exist.",
      });
    }
    bookingGroupObject = {
      connect: {
        id: parseInt(bookingGroupId)
      }
    }
  }

  // the way that the booking is created depends on whether the leadGuestId has been provided
  try {
    if (path === "EXISTINGGUEST") {
      const result = await prisma.booking.create({
        data: {
          start: new Date(startDate),
          end: new Date(endDate),
          equipmentType: {
            connect: {
              id: parseInt(equipmentTypeId),
            },
          },
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
          status: BOOKING_STATUSES.CONFIRMED,
          bookingGroup: bookingGroupObject
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
          equipmentType: {
            connect: {
              id: parseInt(equipmentTypeId as string),
            },
          },
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
          status: BOOKING_STATUSES.CONFIRMED,
          bookingGroup: bookingGroupObject
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

  // parse the request body
  let bookingId, leadGuestId;

  try {
    const { id } = parseObj(req.params, validationRulesMap);
    bookingId = id;
    const { leadGuestId: localLeadGuestId } = parseObj(req.body, validationRulesMap);
    leadGuestId = localLeadGuestId;
  }
  catch (err) {
    return res.status(400).json({ message: "malformed query variables" })
  }

  // ensure that we have all the required data
  if (!bookingId || !leadGuestId) {
    return res.status(400).json({
      message: "Bad request - missing data",
    });
  }

  // ensure that the booking exists
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
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
      id: leadGuestId,
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
      id: bookingId,
    },
    data: {
      leadGuest: {
        connect: {
          id: leadGuestId,
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

  let id, firstName, lastName, email, tel, address1, address2, townCity, county, postcode, country

  try {
    const {
      firstName: localFirstName,
      lastName: localLastName,
      email: localEmail,
      tel: localTel,
      address1: localAddress1,
      address2: localAddress2,
      townCity: localTownCity,
      county: localCounty,
      postcode: localPostcode,
      country: localCountry,
    } = parseObj(req.body, validationRulesMap)

    firstName = localFirstName
    lastName = localLastName
    email = localEmail
    tel = localTel
    address1 = localAddress1
    address2 = localAddress2
    townCity = localTownCity
    county = localCounty
    postcode = localPostcode
    country = localCountry

    const { id: localId } = parseObj(req.params, validationRulesMap);
    id = localId;
  }
  catch (err) {
    return res.status(400).json({ message: "malformed query variables" })
  }

  // ensure that we have all the required data
  if (
    !id ||
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

  // ensure that the booking exists
  const booking = await prisma.booking.findUnique({
    where: {
      id,
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
        id,
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

export async function generateFeeCalcs(req: Request, res: Response) {
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

  let parsedUnitTypeId = parseInt(unitTypeId);
  let parsedStartDate = new Date(startDate);
  let parsedEndDate = new Date(endDate);
  let parsedExtras = extras ? extras.map((extra) => parseInt(extra as unknown as string)) : [];

  const totalFee = await calculateFee(parsedUnitTypeId, parsedStartDate, parsedEndDate, parsedExtras, bookingGuests, prisma);

  return res.json({ data: { status: "SUCCESS", message: "Fee calculated", totalFee: totalFee } });
};

export async function updateBooking(req: Request, res: Response) {
  // ensure that the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // get the booking id from the request
  let id = req.params.id;

  // parse the request body
  let start: Date | undefined, end: Date | undefined, unitId: number | undefined, totalFee: number | undefined, leadGuestId: number | undefined, status: string | undefined, bookingGroupId: number | undefined;

  try {
    const {
      start: localStart,
      end: localEnd,
      unitId: localUnitId,
      totalFee: localTotalFee,
      leadGuestId: localLeadGuestId,
      status: localStatus,
      bookingGroupId: localBookingGroupId
    } = parseObj(req.body.changedItems, validationRulesMap)

    start = localStart
    end = localEnd
    unitId = localUnitId
    totalFee = localTotalFee
    leadGuestId = localLeadGuestId
    status = localStatus
    bookingGroupId = localBookingGroupId
  }
  catch (err) {
    return res.status(400).json({ message: "malformed query variables" })
  }

  // get the booking and ensure that the user has access to it
  const booking = await prisma.booking.findUnique({
    where: {
      id: parseInt(id),
      unit: {
        unitType: {
          site: {
            tenantId: req.user.tenantId,
          },
        },
      },
    },
    include: {
      calendarEntries: true,
    },
  });

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found",
    });
  }

  let calendarConnectArr: {id: any}[] = [];
  let calendarDisconnectArr: {id: any}[] = [];

  // if start, end or unitId are being updated, check that the new values have availability
  if (start || end || unitId || status === BOOKING_STATUSES.CONFIRMED) {
    // check that the dates are available
    const {applicableCalendarEntries, areAllDatesAvailable} = await confirmRequestedDatesAreAvailableForUnit(prisma, unitId || booking.unitId, start || booking.start, end || booking.end);

    if (!areAllDatesAvailable) {
      return res.status(400).json({
        message: "Bad request - some dates are not available",
      });
    }

    if (applicableCalendarEntries.length === 0) {
      return res.status(400).json({
        message:
          "Bad request - no calendar entries found for this unit and date range.  Something is wrong with the setup.",
      });
    }

    // FUTURE_EFFICENCY: when moving from PENDING to CONFIRMED, there is no need to do this. 
    calendarConnectArr = applicableCalendarEntries.map((entry) => {
      return {
        id: entry.id,
      };
    });

    calendarDisconnectArr = booking.calendarEntries.map((entry) => {
      return {
        id: entry.id,
      };
    }
    );
  }

  // if cancelling a booking, disconnect all calendar entries
  if (status === BOOKING_STATUSES.CANCELLED) {
    calendarDisconnectArr = booking.calendarEntries.map((entry) => {
      return {
        id: entry.id,
      };
    });
  }

  // TODO : if start, end or unitID have been updated, recalculate the totalFee

  // update the booking
  let data;
  
  try {
    data = await prisma.booking.update({
      where: {
        id: parseInt(id),
      },
      data: {
        start,
        end,
        unitId,
        totalFee,
        leadGuestId,
        status,
        bookingGroupId,
        calendarEntries: {
          connect: calendarConnectArr,
          disconnect: calendarDisconnectArr
        }
      },
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }

  return res.status(200).json({ data: data });

}