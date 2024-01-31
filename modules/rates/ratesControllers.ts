import { Request, Response } from "express";
import { prisma } from "../../index.js";

enum RateType {
    BASE = "BASE",
    GUEST = "GUEST",
    PET = "PET",
    VEHICLE = "VEHICLE",
  }

const RATE_TYPES = {
    BASE: "BASE",
    GUEST: "GUEST",
    PET: "PET",
    VEHICLE: "VEHICLE",
  };
  
  type ChangedItems = {
    id: number;
    type: RateType;
    newValuePerNight: number | null;
    newValuePerStay: number | null;
  }[];

export async function updateRates(req: Request, res: Response) {
    // check that the user is logged in
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { changedItems } = req.body;

    if (!changedItems) {
      return res.status(400).json({
        message: "changedRates array must be provided",
      });
    }

    // parse the changedRates array
    const baseRates: ChangedItems = [];
    const guestRates: ChangedItems = [];

    (changedItems as ChangedItems).forEach((rate) => {
      if (rate.type === RATE_TYPES.BASE) {
        baseRates.push(rate);
      } else if (rate.type === RATE_TYPES.GUEST) {
        guestRates.push(rate);
      }
    });

    const updateQueries: any = [];

    baseRates.forEach((baseRateUpdate) => {
      const newValuePerNight = baseRateUpdate.newValuePerNight || undefined;
      const newValuePerStay = baseRateUpdate.newValuePerStay || undefined;

      updateQueries.push(
        prisma.unitTypeFeesCalendar.update({
          where: {
            id: baseRateUpdate.id,
          },
          data: {
            feePerNight: newValuePerNight,
            feePerStay: newValuePerStay,
          },
        })
      );
    });

    guestRates.forEach((guestRateUpdate) => {
      const newValuePerNight = guestRateUpdate.newValuePerNight || undefined;
      const newValuePerStay = guestRateUpdate.newValuePerStay || undefined;

      updateQueries.push(
        prisma.guestFeesCalendar.update({
          where: {
            id: guestRateUpdate.id,
          },
          data: {
            feePerNight: newValuePerNight,
            feePerStay: newValuePerStay,
          },
        })
      );
    });

    try {
      await prisma.$transaction(updateQueries);
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Failed to update rates",
      });
    }

    return res.status(200).json({
      message: "Rates updated successfully",
    });
  }