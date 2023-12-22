import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/middleware/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";
import { validateProvidedData } from "../utilities/middleware/validation/middleware.js";

export function registerSiteRoutes(app: Express, prisma: PrismaClient) {
  app.get(
    urls.SITES,
    validateProvidedData,
    loggedIn,
    async (req: Request, res: Response) => {
      // confirm that the user is logged in and has a tenantId
      const { user } = req;
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { tenantId } = user;

      if (!tenantId) {
        res.status(401).json({
          message:
            "Tenant id not accessible on user object.  This is a backend issue.",
        });
        return;
      }

      // destructure query
      const { id } = req.query;

      if (id) {
        // parse id
        const parsedId = parseInt(id as string);
        if (isNaN(parsedId)) {
          return res.status(400).json({ message: "Invalid id" });
        }
        
        // get site by id
        const site = await prisma.site.findUnique({
          where: { id: parsedId },
          include: {
            unitTypes: true,
            guestTypes: true,
            equipmentTypes: true,
          }
        });

        // handle no site found
        if (!site) {
          return res.status(404).json({ message: "Site not found" });
        }

        // check that the site belongs to the tenant that requested it.
        if (site.tenantId !== tenantId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // return site
        return res.status(200).json({ data: site });
      }

      // get all sites for that tenantId
      const sites = await prisma.site.findMany({
        where: { tenantId },
      });

      // return all sites for that tenantId
      return res.status(200).json({ data: sites });
    }
  );

  // ------------------------------

  app.post(
    urls.NEW_SITE,
    validateProvidedData,
    loggedIn,
    async (req: Request, res: Response) => {
      // confirm that the user is logged in and has a tenantId
      const { user } = req;
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { tenantId } = user;

      if (!tenantId) {
        res.status(401).json({
          message:
            "Tenant id not accessible on user object.  This is a backend issue.",
        });
        return;
      }

      // destructure body
      const {
        name,
        description,
        address1,
        address2,
        townCity,
        county,
        postcode,
        country,
        tel,
        email,
        website,
        latitude,
        longitude,
      } = req.body;

      try {
        const newSite = await prisma.site.create({
          data: {
            name,
            description,
            address1,
            address2,
            townCity,
            county,
            postcode,
            country,
            tel,
            email,
            website,
            latitude,
            longitude,
            tenantId,
          },
        });
        // return the new site
        return res.status(200).json({ data: newSite });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating new site." });
      }
    }
  );
}
