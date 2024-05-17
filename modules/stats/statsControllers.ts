import { Request, Response } from "express";
import { prisma } from "../../index.js";

export async function getTotalOnSiteNow(req: Request, res: Response) {
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
  let parsedSiteId = -1
  try {
    parsedSiteId = parseInt(siteId as string);
  } catch (err) {
    return res.status(400).json({
      message: "Bad request - invalid parameters.  You must provide a siteId to which you have access."
    })
  }

  // get the guestTypeGroups we should return stats for.
  const guestTypeGroups = await prisma.guestTypeGroup.findMany({
    where: {
      reportOnSiteNow: true,
      siteId: parsedSiteId
    }
  })

  let totalOnSiteNow = []

  for (const guestTypeGroup of guestTypeGroups) {
    const count = await prisma.bookingGuest.count({
      where: {
        booking: {
          unit: {
            unitType: {
              siteId: parsedSiteId,
            },
          },
        },
        guestType: {
          guestTypeGroup: {
            id: guestTypeGroup.id
          }
        },
        NOT: {
          checkedIn: null,
        },
        checkedOut: null,
      }
    })
    totalOnSiteNow.push({ guestTypeGroupName: guestTypeGroup.name, count })
  }

  return res.status(200).json({ data: { totalOnSiteNow } });

}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

export async function getTotalOnSiteTonight(req: Request, res: Response) {
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
  let parsedSiteId = -1
  try {
    parsedSiteId = parseInt(siteId as string);
  } catch (err) {
    return res.status(400).json({
      message: "Bad request - invalid parameters.  You must provide a siteId to which you have access."
    })
  }

  // get the guestTypeGroups we should return stats for.
  const guestTypeGroups = await prisma.guestTypeGroup.findMany({
    where: {
      reportOnSiteTonight: true,
      siteId: parsedSiteId
    }
  })

  let totalOnSiteTonight = []

  for (const guestTypeGroup of guestTypeGroups) {
    const count = await prisma.bookingGuest.count({
      where: {
        start: {
          lte: new Date(new Date().setHours(14, 0, 0, 0))
        },
        end: {
          gte: new Date(new Date().setHours(14, 0, 0, 0))
        },
        booking: {
          unit: {
            unitType: {
              siteId: parsedSiteId,
            },
          },
        },
        guestType: {
          guestTypeGroup: {
            id: guestTypeGroup.id
          }
        }
      }
    })
    totalOnSiteTonight.push({ guestTypeGroupName: guestTypeGroup.name, count })
  }

  return res.status(200).json({ data: { totalOnSiteTonight } });
}

export async function getTotalPaymentsToday(req: Request, res: Response) {
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
  let parsedSiteId = -1
  try {
    parsedSiteId = parseInt(siteId as string);
  } catch (err) {
    return res.status(400).json({
      message: "Bad request - invalid parameters.  You must provide a siteId to which you have access."
    })
  }
 
  const data = await prisma.payment.aggregate({
    _sum: {
      paymentAmount: true
    },
    where: {
      paymentDate: {
        gte: new Date(new Date().setHours(0,0,0,0)),
        lte: new Date(new Date().setHours(23,59,59,59))
      }
    }
  })

  return res.status(200).json({data})
}

export async function getPaymentsBreakdownToday(req: Request, res: Response) {
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
  let parsedSiteId = -1
  try {
    parsedSiteId = parseInt(siteId as string);
  } catch (err) {
    return res.status(400).json({
      message: "Bad request - invalid parameters.  You must provide a siteId to which you have access."
    })
  }

  const data = await prisma.payment.groupBy({
    by: ['paymentMethod'],
    _sum: {
      paymentAmount: true
    },
    where: {
      paymentDate: {
        gte: new Date(new Date().setHours(0,0,0,0)),
        lte: new Date(new Date().setHours(23,59,59,59))
      }
    }
  })

  return res.status(200).json({ data }); 
}