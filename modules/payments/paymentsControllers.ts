import { Request, Response } from "express";

export async function getPayments(req: Request, res: Response) {
  // return all payments here, paginated.
  return res.status(501).json({ message: "Not implemented" });
}

export async function getPaymentById(req: Request, res: Response) {
  // return payments by id here.
  return res.status(501).json({ message: "Not implemented" });
}

export async function getPaymentsByBookingId(req: Request, res: Response) {
  // return payments by bookingId here, paginated.
  return res.status(501).json({ message: "Not implemented" });
}
