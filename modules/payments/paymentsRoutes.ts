import { Request, Response } from "express";
import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";

export function registerPaymentRoutes() {
  app.get(urls.PAYMENTS, validateProvidedData, loggedIn, async (req: Request, res: Response) => {
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
