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
} from "./departureControllers.js";

export function registerCheckOutRoutes() {
  app.put(urls.CHECK_OUT_GUEST, validateProvidedData, loggedIn, hasAccessToRequestedSite, checkOutGuest);
  app.put(
    urls.CHECK_OUT_MANY_GUESTS,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    checkoutManyGuests
  );
}
