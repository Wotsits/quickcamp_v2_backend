import { Request, Response } from "express";
import { prisma } from "../../index.js";

export async function getBookingGroupById(req: Request, res: Response) {
    // ensure we have the user on the request
    const { user } = req;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    // get the tenantId of the user which is used later to validate permission to view.
    const { tenantId } = user

    // get the bookingGroupId
    const { id: bookingGroupId } = req.query;

    // parse supplied data
    const parsedBookingGroupId = parseInt(bookingGroupId as string);

    // get the bookingGroup
    const data = await prisma.bookingGroup.findUnique({
        where: {
            id: parsedBookingGroupId,
            site: {
                tenantId
            }
        },
        include: {
            bookings: {
                include: {
                    leadGuest: true,
                    unit: true,
                    guests: true
                }
            }
        },
    });

    // ensure the bookingGroup exists
    if (!data) {
        return res.status(404).json({
            message: "BookingGroup not found",
        });
    }

    // return the booking
    return res.status(200).json({ data: data });
}