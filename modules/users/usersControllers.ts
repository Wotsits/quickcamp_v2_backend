import { Request, Response } from "express";
import { prisma } from "../../index.js";

export async function getUsers(req: Request, res: Response) {
  const { user } = req;
  if (!user) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const { tenantId } = user;
  if (!tenantId) {
    res
      .status(401)
      .send({
        message:
          "Tenant id not accessible on user object.  This is a backend issue.",
      });
    return;
  }

  const users = await prisma.user.findMany({
    where: { tenantId },
    include: {
      roles: true,
    },
  });

  return res.status(200).json({ data: users });
}
