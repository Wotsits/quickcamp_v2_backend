import {Express, Request, Response} from 'express';
import { entityTypes, urls } from '../enums.js';
import { loggedIn } from '../utilities/userManagement/middleware.js';
import { getAll } from '../dataFetchers/getAll.js';
import { PrismaClient } from '@prisma/client';
import { getOneById } from '../dataFetchers/getOneById.js';

export function registerVehicleRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.VEHICLES, loggedIn, async (req: Request, res: Response) => {
        // return all vehicles here, paginated.
        const data = await getAll(entityTypes.VEHICLE, prisma);
        res.json(data);
      });
    
      app.get(
        `${urls.VEHICLES}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return vehicle by id here.
          const id = parseInt(req.params.id);
          const data = await getOneById(entityTypes.VEHICLE, id, prisma);
          res.json(data);
        }
      );
}