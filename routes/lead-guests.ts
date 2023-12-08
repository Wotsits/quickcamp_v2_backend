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

    // if the request has a query string, search for guests that match the query string
    if (req.query.q) {
      const data = await prisma.leadGuest.findMany({
        where: {
          tenantId: tenantId,
          OR: [
            {
              firstName: {
                contains: req.query.q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: req.query.q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
            {
              email: {
                contains: req.query.q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
            {
              tel: {
                contains: req.query.q as string,
                // TODO: When I switch to postgres, I can use the following:
                // mode: "insensitive",
              },
            },
          ],
        },
      });
      return res.status(200).json({ data });
    }

    // return all guests here, paginated.
    const data = await prisma.leadGuest.findMany({
      where: {
        tenantId: tenantId,
      },
    });
    res.status(200).json({ data });
  });
}
