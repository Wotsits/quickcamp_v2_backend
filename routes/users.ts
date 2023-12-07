import { Express, Request, Response } from "express";
import { urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { PrismaClient } from "@prisma/client";

export function registerUserRoutes(app: Express, prisma: PrismaClient) {
  app.get(urls.USERS, loggedIn, async (req: Request, res: Response) => {
    const { user } = req;
    if (!user) {
      res.status(401).send({ message: "Not logged in" });
      return;
    }

    const { tenantId } = user;
    if (!tenantId) {
      res.status(401).send({ message: "Not logged in" });
      return;
    }

    const users = await prisma.user.findMany({
      where: { tenantId },
      include: {
        roles: true,
      },
    });

    return res.status(200).json({ data: users });
  });
}
