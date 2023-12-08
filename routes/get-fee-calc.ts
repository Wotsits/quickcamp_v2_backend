import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/middleware/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { calculateFee } from "../utilities/calculateFee.js";
import { BookingProcessGuest, BookingProcessPet, BookingProcessVehicle } from "../types.js";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerFeeCalcRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.get(urls.FEECALCS, validateProvidedData, loggedIn, async (req: Request, res: Response) => {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const unitTypeId = req.query.unitTypeId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const extras = req.query.extras as string[];
    const bookingGuests = req.query.bookingGuests as unknown as BookingProcessGuest[];
    const bookingPets = req.query.bookingPets as unknown as BookingProcessPet[];
    const bookingVehicles = req.query.bookingVehicles as unknown as BookingProcessVehicle[];

    let parsedUnitTypeId = parseInt(unitTypeId);
    let parsedStartDate = new Date(startDate);
    let parsedEndDate = new Date(endDate);
    let parsedExtras = extras ? extras.map((extra) => parseInt(extra as unknown as string)) : [];

    const totalFee = await calculateFee(parsedUnitTypeId, parsedStartDate, parsedEndDate, parsedExtras, bookingGuests, bookingPets, bookingVehicles, prisma);

    return res.json({ data: { status: "SUCCESS", message: "Fee calculated", totalFee: totalFee } } );
  });
}
