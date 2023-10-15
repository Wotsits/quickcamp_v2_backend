import {Express, Request, Response} from 'express';
import { urls } from '../enums.js';
import { loggedIn } from '../utilities/userManagement/middleware.js';
import { PrismaClient } from '@prisma/client';

export function registerVehicleRoutes(app: Express, prisma: PrismaClient) {
    app.get(urls.VEHICLES, loggedIn, async (req: Request, res: Response) => {
        // return all vehicles here, paginated.
      });
    
      app.get(
        `${urls.VEHICLES}/:id`,
        loggedIn,
        async (req: Request, res: Response) => {
          // return vehicle by id here.
        }
      );
}