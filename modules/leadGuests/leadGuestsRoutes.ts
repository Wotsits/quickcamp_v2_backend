import { Request, Response } from "express";
import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app, prisma } from "../../index.js";
import { getLeadGuests, updateLeadGuest } from "./leadGuestsControllers.js";

export function registerLeadGuestRoutes() {
  app.get(
    urls.LEADGUESTS,
    validateProvidedData,
    loggedIn,
    getLeadGuests
  );
  app.put(
    urls.UPDATE_LEAD_GUEST,
    validateProvidedData,
    loggedIn,
    updateLeadGuest
  );
}
