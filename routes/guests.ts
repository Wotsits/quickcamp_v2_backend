import { PrismaClient } from "@prisma/client";
import { Express, Request, Response } from "express";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { getAll } from "../dataFetchers/getAll.js";
import { getOneById } from "../dataFetchers/getOneById.js";

export function registerGuestRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.GUESTS, loggedIn, async (req: Request, res: Response) => {
      
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      
      const { tenantId } = req.user;
        // return all guests here, paginated.
        const data = await prisma.leadGuest.findMany({
          where: {
            tenantId: tenantId,
          },
        });
        res.json(data);
      });
    
      app.get(
        `${urls.GUESTS}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return guest by id here.
          const id = parseInt(req.params.id);
          const data = await getOneById(entityTypes.GUEST, id, prisma);
          res.json(data);
        }
      );
}