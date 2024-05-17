import { Request, Response } from "express";
import { prisma } from "../../index.js";
import { raiseConsoleErrorWithListOfMissingData } from "../../utilities/commonHelpers/raiseErrorWithListOfMissingData.js";
import { isGuestDue } from "./arrivalsHelpers.js";
import { BOOKING_STATUSES } from "../../enums.js";

export async function getArrivalsByDate(req: Request, res: Response) {
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

  return res.status(200).json({ data });
}

export async function checkInGuest(req: Request, res: Response) {
  // check that the user is logged in
  const { user } = req;
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // unpack the request body
  const { id, reverse } = req.body;

  // check that the required data is present
  if (!id || reverse === undefined) {
    const requiredData = {
      id,
      reverse,
    };
    raiseConsoleErrorWithListOfMissingData(requiredData);
    return res.status(400).json({
      message: "Bad request - missing id or type",
    });
  }

  if (typeof reverse !== "boolean") {
    return res.status(400).json({
      message: "Bad request - invalid datatype for supplied 'reverse' field",
    });
  }

  const guest = await prisma.bookingGuest.findUnique({
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
  });

  // check that the guest exists
  if (!guest || guest === null) {
    return res.status(404).json({
      message: "Not found",
    });
  }

  // check that the user has access to the siteId for which the guest is being checked in
  const userSites = user.sites;
  const targetSite = userSites.find(
    (site) => site.id === guest!.booking.unit.unitType.site.id
  );

  if (!targetSite) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  if (!reverse) {
    // check that the guest is not already checked in
    if (guest.checkedIn) {
      return res.status(400).json({
        message: "Bad request - guest already checked in",
      });
    }
  } else {
    // check that the guest is already checked in
    if (!guest.checkedIn) {
      return res.status(400).json({
        message: "Bad request - guest not checked in",
      });
    }
  }

  // check that the guest is not already checked out
  if (guest.checkedOut) {
    return res.status(400).json({
      message: "Bad request - guest already checked out",
    });
  }

  // check that the guest is due to check in
  if (!isGuestDue(guest)) {
    return res.status(400).json({
      message: "Bad request - guest not due",
    });
  }

  // check that the booking is not cancelled
  if (guest.booking.status !== BOOKING_STATUSES.CONFIRMED) {
    return res.status(400).json({
      message: "Bad request - booking cancelled",
    });
  }

  let updatedThing;
  // check the guest in
  const updatedGuest = await prisma.bookingGuest.update({
    where: {
      id: id,
    },
    data: {
      checkedIn: !reverse ? new Date() : null,
    },
  });

  return res.status(200).json({ data: updatedThing });
}

export async function checkInManyGuests(req: Request, res: Response) {
  // check that the user is logged in
  const { user } = req;
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // unpack the request body
  const { guests, reverse } = req.body;

  // check that the required data is present
  if (!guests) {
    const requiredData = {
      guests,
      reverse,
    };
    raiseConsoleErrorWithListOfMissingData(requiredData);
    return res.status(400).json({
      message: "Bad request - missing guests to check in",
    });
  }

  // check that the guests data is valid
  let isValid = true;
  for (let i = 0; i < guests.length; i++) {
    const guest = guests[i];
    if (!guest.id) {
      isValid = false;
      break;
    }
    try {
      parseInt(guest.id);
    } catch (err) {
      isValid = false;
      break;
    }
  }
  if (!isValid) {
    return res.status(400).json({
      message: "Bad request - invalid guests data",
    });
  }

  // check that the user has access to the siteId for which the guest is being checked in

  // validate each of the guests.
  for (const guest of guests) {
    const targetGuest = await prisma.bookingGuest.findUnique({
      where: {
        id: guest.id,
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
    });

    // check that the guest exists
    if (!targetGuest || targetGuest === null) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // check that the user has access to the siteId for which the guest is being checked in
    const userSites = user.sites;
    const targetSite = userSites.find(
      (site) => site.id === targetGuest!.booking.unit.unitType.site.id
    );

    if (!targetSite) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!reverse) {
      // check that the guest is not already checked in
      if (targetGuest.checkedIn) {
        return res.status(400).json({
          message: "Bad request - guest already checked in",
        });
      }
    } else {
      // check that the guest is already checked in
      if (!targetGuest.checkedIn) {
        return res.status(400).json({
          message: "Bad request - guest not checked in",
        });
      }
    }

    // check that the guest is not already checked out
    if (targetGuest.checkedOut) {
      return res.status(400).json({
        message: "Bad request - guest already checked out",
      });
    }

    // check that the guest is due to check in
    if (!isGuestDue(targetGuest)) {
      return res.status(400).json({
        message: "Bad request - guest not due",
      });
    }

    // check that the booking is not cancelled
    if (targetGuest.booking.status !== "CONFIRMED") {
      return res.status(400).json({
        message: "Bad request - booking cancelled",
      });
    }
  }

  let now = new Date();
  let guestsToUpdate = guests.map((guest: { id: number }) => guest.id);

  const checkedInGuests = await prisma.bookingGuest.updateMany({
    where: {
      id: {
        in: guestsToUpdate,
      },
    },
    data: {
      checkedIn: !reverse ? now : null,
    },
  });

  return res.status(200).json({
    data: {
      guestsUpdated: checkedInGuests,
    },
  });
}
