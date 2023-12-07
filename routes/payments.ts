import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerPaymentRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.PAYMENTS, loggedIn, async (req: Request, res: Response) => {
    // return all payments here, paginated.
  });

  app.get(
    `${urls.PAYMENTS}/:id`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return payments by id here.
      return res.status(501).json({ message: "Not implemented" });
    }
  );

  app.get(
    `${urls.PAYMENTS}/:bookingId`,
    loggedIn,
    async (req: Request, res: Response) => {
      // return payments by bookingId here, paginated.
      return res.status(501).json({ message: "Not implemented" });
    }
  );
}
