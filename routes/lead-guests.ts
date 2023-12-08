import { PrismaClient } from "@prisma/client";
import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerLeadGuestRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.LEADGUESTS, validateProvidedData, loggedIn, async (req: Request, res: Response) => {
    // check that the user is logged in
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { tenantId } = user;

    if (!tenantId) {
      return res.status(401).json({
        message: "Tenant id not accessible on user object.  This is a backend issue.",
      });
    }

    const { q, skip, take } = req.query;

    // parse the skip and take query params
    let parsedSkip = skip ? parseInt(skip as string) : 0 // default to 0 if skip is not provided;
    let parsedTake = take ? parseInt(take as string) : 10 // default to 10 if take is not provided; 

    // if the request has a query string, search for guests that match the query string
    if (q) {
      const count = await prisma.leadGuest.count({
        where: {
          tenantId: tenantId,
          OR: [
            {
              firstName: {
                contains: q as string,
              }
            },
            {
              lastName: {
                contains: q as string,
              }
            },
            {
              email: {
                contains: q as string,
              }
            },
            {
              tel: {
                contains: q as string,
              }
            },
          ],
        },
      });

      const data = await prisma.leadGuest.findMany({
        where: {
          tenantId: tenantId,
          OR: [
            {
              firstName: {
                contains: q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
            {
              email: {
                contains: q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
            {
              tel: {
                contains: q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
          ],
        },
        skip: parsedSkip,
        take: parsedTake,
        orderBy: {
          id: "desc",
        },
      });
      return res.status(200).json({ data, count });
    }

    // if the request does not have a query string, return all guests
    const count = await prisma.leadGuest.count({
      where: {
        tenantId: tenantId,
      },
    });

    const data = await prisma.leadGuest.findMany({
      where: {
        tenantId: tenantId,
      },
      skip: parsedSkip,
      take: parsedTake,
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({ data, count });
  });
}
