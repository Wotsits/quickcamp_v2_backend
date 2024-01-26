import { Request, Response } from "express";
import { prisma } from "../../index.js";

export async function getEquipmentTypes (req: Request, res: Response) {

    // check if user is logged in
    const {user} = req;
    if (!user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    let includeSite = false;

    if (req.query.includeSite) {
      includeSite = req.query.includeSite === "true";
    }

    const { tenantId } = user;

    if (!tenantId) {
      res.status(401).json({ message: "Tenant id not accessible on user object.  This is a backend issue." });
      return;
    }

    const { siteId } = req.query;

    // if siteId is not provided, return all equipment-types for the tenant.
    if (!siteId) {
      const data = await prisma.equipmentType.findMany({
        where: {
          site: {
            tenantId: tenantId,
          },
        },
        include: {
          site: includeSite,
        },
      });
      return res.status(200).json({ data });
    }
    // if siteId is provided, return all equipment-types for the site.
    else {
      const data = await prisma.equipmentType.findMany({
        where: {
          siteId: parseInt(siteId as string),
        },
        include: {
          site: includeSite,
        },
      });
      return res.status(200).json({ data });
    }
  }