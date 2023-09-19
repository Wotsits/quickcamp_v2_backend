import { Express, Request, Response } from "express";
import { entityTypes, urls } from "../enums";
import { loggedIn } from "../utilities/userManagement/middleware";
import { getAll } from "../dataFetchers/getAll";
import { PrismaClient } from "@prisma/client";
import { getOneById } from "../dataFetchers/getOneById";

export function registerPaymentRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.PAYMENTS, loggedIn, async (req: Request, res: Response) => {
    // return all payments here, paginated.
    const data = await getAll(entityTypes.PAYMENT, prisma);
    res.json(data);
  });

  app.get(
    `${urls.PAYMENTS}/:id`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return payments by id here.
      const id = parseInt(req.params.id);
      const data = await getOneById(entityTypes.PAYMENT, id, prisma);
      res.json(data);
    }
  );

  app.get(
    `${urls.PAYMENTS}/:bookingId`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return payments by bookingId here, paginated.
    }
  );
}
