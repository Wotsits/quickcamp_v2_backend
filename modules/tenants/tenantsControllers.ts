import { Request, Response } from "express";

export async function getTenants(req: Request, res: Response) {
  // return all tenants here, paginated.
  return res.status(501).json({ message: "Not implemented" });
}

export async function getTenantById(req: Request, res: Response) {
  // return tenant by id here.
  return res.status(501).json({ message: "Not implemented" });
}
