import { Request, Response } from "express";
import { prisma } from "../../index.js";

export async function getExtraTypes(req: Request, res: Response) {
    // check that the user is logged in
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let includeSite = false;
    let includeUnitTypes = false;

    if (req.query.includeSite) {
      includeSite = req.query.includeSite === "true";
    }
    if (req.query.includeUnitTypes) {
      includeUnitTypes = req.query.includeUnitTypes === "true";
    }

    const { tenantId } = user;

    if (!tenantId) {
      return res.status(401).json({
        message: "Tenant id not accessible on user object.  This is a backend issue.",
      });
    }

    const { siteId } = req.query;

    // if siteId is not provided, return all extraTypes for the tenant.
    if (!siteId) {
      const data = await prisma.extraType.findMany({
        where: {
          unitTypes: {
            some: {
              site: {
                tenantId: tenantId,
              },
            },
          },
        },
        include: {
          ...(includeSite && { unitTypes: { include: { site: true } } }),
          ...(includeUnitTypes && { unitTypes: true }),
        },
      });
      return res.status(200).json({ data });
    }
    // if siteId is provided, return all extraTypes for the site.
    else {
      const data = await prisma.extraType.findMany({
        where: {
          unitTypes: {
            some: {
              siteId: parseInt(siteId as string),
            },
          },
        },
        include: {
          ...(includeSite && { unitTypes: { include: { site: true } } }),
          ...(includeUnitTypes && { unitTypes: true }),
        },
      });
      return res.status(200).json({ data });
    }
  }