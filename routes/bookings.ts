import {Express, Request, Response} from 'express';
import { entityTypes, urls } from '../enums.js';
import { loggedIn } from '../utilities/userManagement/middleware.js';
import { getAll } from '../dataFetchers/getAll.js';
import { PrismaClient } from '@prisma/client';
import { getOneById } from '../dataFetchers/getOneById.js';

export function registerBookingRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.BOOKINGS, loggedIn, async (req: Request, res: Response) => {
        const { start, end, siteId } = req.query;
    
        // --------------
    
        // check that user is allowed to access this siteId
        const site = await prisma.site.findUnique({
          where: {
            id: parseInt(siteId as string),
          },
          include: {
            tenant: true,
          },
        });
        if (!site) {
          return res.status(404).json({
            message: "Site not found",
          });
        }
        const user = req.user;
        if (!user) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
        if (user.tenantId !== site.tenantId) {
          return res.status(403).json({
            message: "Forbidden",
          });
        }
    
        // --------------
    
        if (start && end && siteId) {
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
              guests: true,
              pets: true,
              vehicles: true,
              payments: true,
            }
          });
          return res.json(data);
        }
        // return all bookings here, paginated.
        const data = await getAll(entityTypes.BOOKING, prisma);
        res.json(data);
      });
    
      app.get(
        `${urls.BOOKING}`,
        loggedIn,
        async (req: Request, res: Response) => {
          // ensure we have the user on the request
          const user = req.user;
          if (!user) {
            return res.status(401).json({
              message: "Unauthorized",
            });
          }

          // get the user's tenancy
          const tenantId = user?.tenantId;

          // get the booking
          const data = await prisma.booking.findUnique({
            where: {
              id: parseInt(req.query.id as string),
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
            }
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
    }