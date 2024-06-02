import { Request, Response } from "express";
import { prisma } from "../../index.js";
import { ParsedQs } from "qs";
import { parseObj } from "../../utilities/commonHelpers/parseObj.js";

export async function getBookingGroupById(req: Request, res: Response) {
    // ensure we have the user on the request
    const { user } = req;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    // get the bookingGroupId and siteId from the request
    let bookingGroupId, siteId;

    try {
        const {id: localId, siteId: localSiteId} = parseObj(req.query)

        bookingGroupId = localId;
        siteId = localSiteId;
    }
    catch (error) {
        return res.status(400).json({
            message: "Bad request",
        });
    }

    // get the bookingGroup
    const data = await prisma.bookingGroup.findUnique({
        where: {
            id: bookingGroupId,
            site: {
                id: siteId
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