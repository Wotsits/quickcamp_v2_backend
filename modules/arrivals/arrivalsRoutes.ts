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
} from "./arrivalsControllers.js";

export function registerCheckInRoutes() {
  app.put(urls.CHECK_IN_GUEST, validateProvidedData, loggedIn, hasAccessToRequestedSite, checkInGuest);
  app.put(
    urls.CHECK_IN_MANY_GUESTS,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    checkInManyGuests
  );
}
