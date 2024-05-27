import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import {
  bookingById,
  createBooking,
  generateFeeCalcs,
  getBookings,
  updateBookingLeadGuestExisting,
  updateBookingLeadGuestNew,
} from "./bookingsControllers.js";

export function registerBookingRoutes() {
  app.get(`${urls.BOOKING}/:id`, validateProvidedData, loggedIn, bookingById);
  app.get(urls.BOOKING, validateProvidedData, loggedIn, getBookings)
  app.post(
    urls.NEW_BOOKING,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    createBooking
  );
  app.post(
    urls.UPDATE_BOOKING_LEAD_GUEST_EXISTING,
    validateProvidedData,
    loggedIn,
    updateBookingLeadGuestExisting
  );
  app.post(
    urls.UPDATE_BOOKING_LEAD_GUEST_NEW,
    validateProvidedData,
    loggedIn,
    updateBookingLeadGuestNew
  );
  app.get(urls.FEECALCS, validateProvidedData, loggedIn, generateFeeCalcs);
}
