import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import {
  checkOutGuest,
  checkoutManyGuests,
  getDeparturesByDate,
} from "./departureControllers.js";

export function registerDeparturesRoutes() {
  app.get(
    urls.DEPARTURES_BY_DATE,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getDeparturesByDate
  );
}

export function registerCheckOutRoutes() {
  app.post(urls.CHECK_OUT_GUEST, validateProvidedData, loggedIn, checkOutGuest);
  app.post(
    urls.CHECK_OUT_MANY_GUESTS,
    validateProvidedData,
    loggedIn,
    checkoutManyGuests
  );
}
