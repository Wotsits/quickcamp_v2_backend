import { PrismaClient } from "@prisma/client";
import { Express, Request, Response } from "express";
import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";

export function registerLeadGuestRoutes(app: Express, prisma: PrismaClient) {
  app.get(
    urls.LEADGUESTS,
    validateProvidedData,
    loggedIn,
    async (req: Request, res: Response) => {
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
          message:
            "Tenant id not accessible on user object.  This is a backend issue.",
        });
      }

      const { q, id, skip, take } = req.query;

      // parse the skip and take query params
      let parsedSkip = skip ? parseInt(skip as string) : 0; // default to 0 if skip is not provided;
      let parsedTake = take ? parseInt(take as string) : 10; // default to 10 if take is not provided;
      let parsedId = id ? parseInt(id as string) : -1; // default to -1 if id is not provided;

      // if the request has an id string, search for the guest that matches the id
      if (id) {
        const data = await prisma.leadGuest.findUnique({
          where: {
            id: parsedId,
          },
          include: {
            tenant: true,
            notes: {
              orderBy: {
                id: "desc",
              },
              include: {
                user: true,
              },
            },
            bookings: {
              orderBy: {
                id: "desc",
              },
              include: {
                unit: {
                  include: {
                    unitType: true,
                  },
                },
              },
            },
          },
        });
        // if the guest is not found, return a 404
        if (!data) {
          return res.status(404).json({
            message: "Lead guest not found",
          });
        }
        // if the guest is found, check that the guest belongs to the tenant
        if (data.tenantId !== tenantId) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
        // if the guest belongs to the tenant, return the guest
        return res.status(200).json({ data });
      }

      // if the request has a query string, search for guests that match the query string
      if (q) {
        const count = await prisma.leadGuest.count({
          where: {
            tenantId: tenantId,
            OR: [
              {
                firstName: {
                  contains: q as string,
                },
              },
              {
                lastName: {
                  contains: q as string,
                },
              },
              {
                email: {
                  contains: q as string,
                },
              },
              {
                tel: {
                  contains: q as string,
                },
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
    }
  );

  // ------------------------

  app.put(
    urls.UPDATE_LEAD_GUEST,
    validateProvidedData,
    loggedIn,
    async (req: Request, res: Response) => {
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
          message:
            "Tenant id not accessible on user object.  This is a backend issue.",
        });
      }

      const {
        id,
        firstName,
        lastName,
        tel,
        email,
        address1,
        address2,
        townCity,
        county,
        postcode,
        country,
      } = req.body;

      const parsedId = parseInt(id);

      const existingLeadGuest = await prisma.leadGuest.findFirst(
        {
          where: {
            id: parsedId
          }
        }
      )

      if (!existingLeadGuest) {
        return res.status(404).json({
          message: "Lead guest not found",
        });
      }

      // check that the user has access to the guest
      if (existingLeadGuest.tenantId !== tenantId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const updatedLeadGuest = await prisma.leadGuest.update({
        where: {
          id: parsedId,
        },
        data: {
          firstName,
          lastName,
          tel,
          email,
          address1,
          address2,
          townCity,
          county,
          postcode,
          country,
        },
      });

      return res.status(200).json({ data: updatedLeadGuest });
    }
  );
}
