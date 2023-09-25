import { PrismaClient } from "@prisma/client";
import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { UserResponse } from "../types.js";

export function registerExtraTypeRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.EXTRATYPES, loggedIn, async (req: Request, res: Response) => {
    const params = req.query;
    let siteId: number | null;
    
    // check that the siteId is a number
    if (params.siteId) {
        try {
            siteId = parseInt(params.siteId as string);
        }
        catch (e) {
            return res.status(400).json({
                message: "Bad request",
            });
        }
    }
    else siteId = null;

    if (siteId === null) {
        return res.status(400).json({
            message: "Bad request",
        });
    }

    // check that the user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // check that the user has access to the siteId
    const sitesToWhichUserHasAccess = (req.user as unknown as UserResponse).sites.map((site) => site.id);
    if (!sitesToWhichUserHasAccess.includes(siteId)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // return all extraTypes here.
    const data = await prisma.extraType.findMany({
        where: {
            unitTypes: {
                some: {
                    siteId
                },
            },
        }
    });

    // return all guests here, paginated.
    res.json(data);
  });
}
