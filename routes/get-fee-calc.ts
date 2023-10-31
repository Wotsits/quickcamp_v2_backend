import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { calculateFee } from "../utilities/calculateFee.js";
import { BookingProcessGuest, BookingProcessPet, BookingProcessVehicle } from "../types.js";

export function registerFeeCalcRoutes(app: Express, prisma: PrismaClient) {
  // ****************************************************

  app.get(urls.FEECALCS, loggedIn, async (req: Request, res: Response) => {
    if (!req.user) {
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

    let parsedUnitTypeId: number;
    let parsedStartDate: Date;
    let parsedEndDate: Date;
    let parsedExtras: number[]

    try {
      parsedUnitTypeId = parseInt(unitTypeId);
      parsedStartDate = new Date(startDate);
      parsedEndDate = new Date(endDate);
      parsedExtras = extras.map((extra) => parseInt(extra as unknown as string));
    } catch {
      return res.status(400).json({
        message: "Bad request - invalid parameters.",
      });
    }

    const totalFee = await calculateFee(parsedUnitTypeId, parsedStartDate, parsedEndDate, parsedExtras, bookingGuests, bookingPets, bookingVehicles, prisma);

    return res.json({ data: { status: "SUCCESS", message: "Fee calculated", totalFee: totalFee } } );
  });
}