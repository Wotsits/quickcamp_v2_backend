import { PrismaClient } from "@prisma/client";
import { Express, Request, Response } from "express";
import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";

export function registerNoteRoutes(app: Express, prisma: PrismaClient) {
  app.post(
    urls.NEW_NOTE,
    validateProvidedData,
    loggedIn,
    async (req: Request, res: Response) => {
      // check that the user is logged in
      const { user } = req;
      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const { leadGuestId, bookingId, paymentId, bookingGuestId, bookingPetId, bookingVehicleId, content, noteType } = req.body;

      const parsedLeadGuestId = leadGuestId && parseInt(leadGuestId);
      const parsedBookingId = bookingId && parseInt(bookingId);
      const parsedPaymentId = paymentId && parseInt(paymentId);
      const parsedBookingGuestId = bookingGuestId && parseInt(bookingGuestId);
      const parsedBookingPetId = bookingPetId && parseInt(bookingPetId);
      const parsedBookingVehicleId = bookingVehicleId && parseInt(bookingVehicleId);

      if (!parsedLeadGuestId && !parsedBookingId && !parsedPaymentId && !parsedBookingGuestId && !parsedBookingPetId && !parsedBookingVehicleId) {
        return res.status(400).json({
          message: "At least one of the following fields must be provided: leadGuestId, bookingId, paymentId, bookingGuestId, bookingPetId, bookingVehicleId",
        });
      }

      if (!content) {
        return res.status(400).json({
          message: "content must be provided",
        });
      }

      if (!noteType) {
        return res.status(400).json({
          message: "noteType must be provided",
        });
      }


      const createdNote = await prisma.note.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          leadGuest: parsedLeadGuestId && {
            connect: {
              id: parsedLeadGuestId,
            },
          },
          booking: parsedBookingId && {
            connect: {
              id: parsedBookingId,
            },
          },
          payment: parsedPaymentId && {
            connect: {
              id: parsedPaymentId,
            },
          },
          bookingGuest: parsedBookingGuestId && {
            connect: {
              id: parsedBookingGuestId,
            },
          },
          bookingPet: parsedBookingPetId && {
            connect: {
              id: parsedBookingPetId,
            },
          },
          bookingVehicle: parsedBookingVehicleId && {
            connect: {
              id: parsedBookingVehicleId,
            },
          },
          content: content,
          createdOn: new Date(),
          noteType: noteType,
        },
      });

      return res.status(200).json({
        message: "Note successfully created",
        note: createdNote,
      });

    }
  );

}
