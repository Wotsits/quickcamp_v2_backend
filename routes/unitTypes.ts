import {Express, Request, Response} from "express";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { getOneById } from "../dataFetchers/getOneById.js";

export function registerUnitTypeRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.UNITTYPES, loggedIn, async (req: Request, res: Response) => {
        // return all unit-types here, paginated.
        const data = await prisma.unitType.findMany({
          include: {
            units: true,
          },
        });
        res.json(data);
      });
    
      app.get(
        `${urls.UNITTYPES}/:siteId`,
        loggedIn,
        async (req: Request, res: Response) => {
          const { siteId } = req.params;
          // return all unit-types here, paginated.
          const data = await prisma.unitType.findMany({
            where: {
              siteId: parseInt(siteId),
            },
            include: {
              units: true,
            },
          });
          res.json(data);
        }
      );
    
      app.get(
        `${urls.UNITTYPES}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return unit-type by id here.
          const id = parseInt(req.params.id);
          const data = getOneById(entityTypes.UNITTYPE, id, prisma);
          res.json(data);
        }
      );
}