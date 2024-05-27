import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import {
  checkInGuest,
  checkInManyGuests,
  getArrivalsByDate,
} from "./arrivalsControllers.js";

export function registerArrivalsRoutes() {
  app.get(
    urls.ARRIVALS,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getArrivalsByDate
  );
}

export function registerCheckInRoutes() {
  app.put(urls.CHECK_IN_GUEST, validateProvidedData, loggedIn, checkInGuest);
  app.put(
    urls.CHECK_IN_MANY_GUESTS,
    validateProvidedData,
    loggedIn,
    checkInManyGuests
  );
}
