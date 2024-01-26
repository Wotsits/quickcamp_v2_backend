import { Request, Response } from "express";
import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import {
  getPaymentById,
  getPayments,
  getPaymentsByBookingId,
} from "./paymentsControllers.js";

export function registerPaymentRoutes() {
  app.get(urls.PAYMENTS, validateProvidedData, loggedIn, getPayments);

  app.get(`${urls.PAYMENTS}/:id`, loggedIn, getPaymentById);

  app.get(`${urls.PAYMENTS}/:bookingId`, loggedIn, getPaymentsByBookingId);
}
