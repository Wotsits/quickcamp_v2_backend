import { Request, Response } from "express";
import { prisma } from "../../index.js";

export async function getGuestTypes (req: Request, res: Response) {
    // belt and braces check that the user is logged in and has a tenantId
    const { user } = req;
    if (!user) {
      res.status(401).json({ message: "Not logged in." });
      return;
    }

    const { tenantId } = user;

    if (!tenantId) {
      res.status(401).json({ message: "Not logged in." });
      return;
    }

    const { siteId } = req.query;

    // if siteId is not provided, return all guest-types for the tenant.
    if (!siteId) {
      const data = await prisma.guestType.findMany({
        where: {
          guestTypeGroup: {
            site: {
              tenantId: tenantId,
            },
          },
        },
      });
      return res.status(200).json({ data });
    }
    // if siteId is provided, return all guest-types for the site.
    else {
      const data = await prisma.guestType.findMany({
        where: {
          guestTypeGroup: {
            siteId: parseInt(siteId as string),
          },
        },
      });
      return res.status(200).json({ data });
    }
  }