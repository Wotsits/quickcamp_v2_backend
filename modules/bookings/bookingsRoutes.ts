import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import {
  getBookingById,
  createBooking,
  generateFeeCalcs,
  getBookings,
  updateBookingLeadGuestExisting,
  updateBookingLeadGuestNew,
  updateBooking,
} from "./bookingsControllers.js";

export function registerBookingRoutes() {
  // GET
  app.get(`${urls.BOOKING}/:id`, validateProvidedData, loggedIn, getBookingById);
  app.get(urls.BOOKING, validateProvidedData, loggedIn, getBookings)
  app.get(urls.FEECALCS, validateProvidedData, loggedIn, generateFeeCalcs);
  // POST
  app.post(
    `${urls.BOOKING}/new`,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    createBooking
  );
  app.post(
    `${urls.BOOKING}/:id/lead-guest`,
    validateProvidedData,
    loggedIn,
    updateBookingLeadGuestExisting
  );
  app.post(
    `${urls.BOOKING}/:id/lead-guest/new`,
    validateProvidedData,
    loggedIn,
    updateBookingLeadGuestNew
  );
  // PUT
  app.put(`${urls.BOOKING}/:id`, validateProvidedData, loggedIn, updateBooking);
}
