import { Request, Response } from "express";
import { prisma } from "../..";
import { raiseConsoleErrorWithListOfMissingData } from "../../utilities/raiseErrorWithListOfMissingData";

export async function getDeparturesByDate(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const siteId = req.query.siteId;
  const date = req.query.date;

  // check that the required data is present
  if (!siteId) {
    return res.status(400).json({
      message: "Bad request - no siteId",
    });
  }

  if (!date) {
    return res.status(400).json({
      message: "Bad request - no date",
    });
  }

  // parse supplied data
  let parsedSiteId = parseInt(siteId as string);
  let parsedDate = new Date(date as string);

  // return bookings here, paginated.
  const data = await prisma.booking.findMany({
    where: {
      unit: {
        unitType: {
          siteId: parsedSiteId,
        },
      },
      OR: [
        {
          guests: {
            some: {
              end: parsedDate,
            },
          },
        },
        {
          pets: {
            some: {
              end: parsedDate,
            },
          },
        },
        {
          vehicles: {
            some: {
              end: parsedDate,
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

  return res.status(200).json({ data });
}

export async function checkOutGuest(req: Request, res: Response) {
  // check that the user is logged in
  const { user } = req;
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // unpack the request body
  const { id, type, reverse } = req.body;

  // check that the required data is present
  if (!id || !type || reverse === undefined) {
    const requiredData = {
      id,
      type,
      reverse,
    };
    raiseConsoleErrorWithListOfMissingData(requiredData);
    return res.status(400).json({
      message: "Bad request - missing id or type",
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
    thing = await prisma.bookingGuest.findUnique(reusableWhereAndIncludeBlock);
  if (type === "PET")
    thing = await prisma.bookingPet.findUnique(reusableWhereAndIncludeBlock);
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

  if (!reverse) {
    // check that the guest is not already checked out
    if (thing.checkedOut) {
      return res.status(400).json({
        message: "Bad request - guest already checked out",
      });
    }
  } else {
    // check that the guest is already checked in
    if (!thing.checkedOut) {
      return res.status(400).json({
        message: "Bad request - guest not checked out",
      });
    }
  }

  // check that the guest is checked in
  if (!thing.checkedIn) {
    return res.status(400).json({
      message: "Bad request - guest is not checked in",
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
        checkedOut: !reverse ? new Date() : null,
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
        checkedOut: !reverse ? new Date() : null,
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
        checkedOut: !reverse ? new Date() : null,
      },
    });
  }

  return res.status(200).json({ data: updatedThing });
}

export async function checkoutManyGuests(req: Request, res: Response) {
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
    if (!guest.id || !guest.type) {
      isValid = false;
      break;
    }
    try {
      parseInt(guest.id);
    } catch (err) {
      isValid = false;
      break;
    }
    if (
      guest.type !== "GUEST" &&
      guest.type !== "PET" &&
      guest.type !== "VEHICLE"
    ) {
      isValid = false;
      break;
    }
  }
  if (!isValid) {
    return res.status(400).json({
      message: "Bad request - invalid guests data",
    });
  }

  if (typeof reverse !== "boolean") {
    return res.status(400).json({
      message: "Bad request - invalid datatype for supplied 'reverse' field",
    });
  }

  // check that the user has access to the siteId for which the guest is being checked in

  const reusableIncludeBlock = {
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

  // validate each of the guests.
  for (const guest of guests) {
    let thing = null;

    if (guest.type === "GUEST")
      thing = await prisma.bookingGuest.findUnique({
        where: {
          id: guest.id,
        },
        ...reusableIncludeBlock,
      });
    if (guest.type === "PET")
      thing = await prisma.bookingPet.findUnique({
        where: {
          id: guest.id,
        },
        ...reusableIncludeBlock,
      });
    if (guest.type === "VEHICLE")
      thing = await prisma.bookingVehicle.findUnique({
        where: {
          id: guest.id,
        },
        ...reusableIncludeBlock,
      });

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

    if (!reverse) {
      // check that the guest is not already checked out
      if (thing.checkedOut) {
        return res.status(400).json({
          message: "Bad request - guest already checked in",
        });
      }
    } else {
      // check that the guest is already checked out
      if (!thing.checkedOut) {
        return res.status(400).json({
          message: "Bad request - guest not checked in",
        });
      }
    }

    // check that the guest is checked in
    if (!thing.checkedIn) {
      return res.status(400).json({
        message: "Bad request - guest no checked in",
      });
    }

    // check that the booking is not cancelled
    if (thing.booking.status !== "CONFIRMED") {
      return res.status(400).json({
        message: "Bad request - booking cancelled",
      });
    }
  }

  let now = new Date();
  let guestsToUpdate: number[] = [];
  let petsToUpdate: number[] = [];
  let vehiclesToUpdate: number[] = [];

  guests.forEach((guest: { id: number; type: "GUEST" | "PET" | "VEHICLE" }) => {
    if (guest.type === "GUEST") {
      guestsToUpdate.push(guest.id);
    }
    if (guest.type === "PET") {
      petsToUpdate.push(guest.id);
    }
    if (guest.type === "VEHICLE") {
      vehiclesToUpdate.push(guest.id);
    }
  });

  const [checkedOutGuests, checkedOutPets, checkedOutVehicles] =
    await prisma.$transaction([
      prisma.bookingGuest.updateMany({
        where: {
          id: {
            in: guestsToUpdate,
          },
        },
        data: {
          checkedOut: !reverse ? now : null,
        },
      }),
      prisma.bookingPet.updateMany({
        where: {
          id: {
            in: petsToUpdate,
          },
        },
        data: {
          checkedOut: !reverse ? now : null,
        },
      }),
      prisma.bookingVehicle.updateMany({
        where: {
          id: {
            in: vehiclesToUpdate,
          },
        },
        data: {
          checkedOut: !reverse ? now : null,
        },
      }),
    ]);

  return res.status(200).json({
    data: {
      guestsUpdated: checkedOutGuests,
      petsUpdated: checkedOutPets,
      vehiclesUpdated: checkedOutVehicles,
    },
  });
}