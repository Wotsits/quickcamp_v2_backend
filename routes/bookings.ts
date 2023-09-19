import {Express, Request, Response} from 'express';
import { entityTypes, urls } from '../enums';
import { loggedIn } from '../utilities/userManagement/middleware';
import { getAll } from '../dataFetchers/getAll';
import { PrismaClient } from '@prisma/client';
import { getOneById } from '../dataFetchers/getOneById';

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
          });
          return res.json(data);
        }
        // return all bookings here, paginated.
        const data = await getAll(entityTypes.BOOKING, prisma);
        res.json(data);
      });
    
      app.get(
        `${urls.BOOKINGS}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return booking by id here.
          const id = parseInt(req.params.id);
          const data = await getOneById(entityTypes.BOOKING, id, prisma);
          res.json(data);
        }
      );
    }