import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { bookingById, bookingsBySite, bookingsBySiteAndDateRange, createBooking, generateFeeCalcs, updateBookingLeadGuestExisting, updateBookingLeadGuestNew } from "./bookingsControllers.js";

export function registerBookingRoutes() {
  // ****************************************************

  app.get(
    urls.BOOKINGS_BY_SITE,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    bookingsBySite
  );

  // ****************************************************

  app.get(
    urls.BOOKINGS_BY_SITE_AND_DATE_RANGE,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    bookingsBySiteAndDateRange
  );

  // ****************************************************

  app.get(
    `${urls.BOOKING_BY_ID}`,
    validateProvidedData,
    loggedIn,
    bookingById
  );

  // ****************************************************

  app.post(
    urls.NEW_BOOKING,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    createBooking
  );

  // ****************************************************

  app.post(
    urls.UPDATE_BOOKING_LEAD_GUEST_EXISTING,
    validateProvidedData,
    loggedIn,
    updateBookingLeadGuestExisting
  );

  // ****************************************************

  app.post(urls.UPDATE_BOOKING_LEAD_GUEST_NEW, validateProvidedData, loggedIn, updateBookingLeadGuestNew);

  // ****************************************************

  app.get(urls.FEECALCS, validateProvidedData, loggedIn, generateFeeCalcs)

}
