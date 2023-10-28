import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerFeeCalcRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.get(urls.FEECALCS, loggedIn, async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log(req.query)
    const unitTypeId = req.query.unitTypeId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const extras = req.query.extras;
    const bookingGuests = req.query.bookingGuests;
    const bookingPets = req.query.bookingPets;
    const bookingVehicles = req.query.bookingVehicles;

    if (!unitTypeId || !startDate || !endDate || !extras || !bookingGuests || !bookingPets || !bookingVehicles) {
      return res.status(400).json({
        message: "Bad request - missing parameters.",
      });
    }

    // get the rates for the unit type

    // get the rates for the extras
    
    // calculate the rate

    // return the calculated rate

    return res.json({ data: { status: "SUCCESS", message: "Fee calculated", totalFee: 100 } } );
  });
}
