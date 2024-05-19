import { app } from "../../index.js";
import { urls } from "../../enums.js";
import { hasAccessToRequestedSite, loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { getBookingGroupById } from "./bookingGroupControllers.js";

export function registerBookingGroupRoutes() {
    app.get(
      urls.BOOKING_GROUPS,
      validateProvidedData,
      loggedIn,
      hasAccessToRequestedSite,
      getBookingGroupById
    );
}