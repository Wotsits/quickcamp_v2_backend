import { PrismaClient } from "@prisma/client";
import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";

export function registerLeadGuestRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.LEADGUESTS, loggedIn, async (req: Request, res: Response) => {
    // check that the user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { tenantId } = req.user;
    
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
      return res.json(data);
    }

    // return all guests here, paginated.
    const data = await prisma.leadGuest.findMany({
      where: {
        tenantId: tenantId,
      },
    });
    res.json(data);
  });
}

