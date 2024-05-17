import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getPaymentsBreakdownToday, getTotalOnSiteNow, getTotalOnSiteTonight, getTotalPaymentsToday, getUnconfirmedBookingCount } from "./statsControllers.js";

export function registerStatsRoutes() {
  app.get(
    urls.STATS + urls.TOTAL_ON_SITE,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getTotalOnSiteNow
  );
  app.get(
    urls.STATS + urls.TOTAL_ON_SITE_TONIGHT,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getTotalOnSiteTonight
  );
  app.get(
    urls.STATS + urls.TOTAL_PAYMENTS_TODAY,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getTotalPaymentsToday
  );
  app.get(
    urls.STATS + urls.PAYMENTS_BREAKDOWN_TODAY,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getPaymentsBreakdownToday
  )
  app.get(
    urls.STATS + urls.UNCONFIRMED_BOOKINGS_COUNT,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getUnconfirmedBookingCount
  )
}
