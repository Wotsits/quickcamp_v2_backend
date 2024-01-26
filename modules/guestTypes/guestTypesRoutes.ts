import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getGuestTypes } from "./guestTypesControllers.js";

export function registerGuestTypeRoutes() {
  app.get(
    `${urls.GUEST_TYPES}`,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getGuestTypes
  );
}
