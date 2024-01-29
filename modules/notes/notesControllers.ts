import { Request, Response } from "express";
import { prisma } from "../../index.js";

export async function createNewNote (req: Request, res: Response) {
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