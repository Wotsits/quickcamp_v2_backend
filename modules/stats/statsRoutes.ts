import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getTotalOnSiteNow, getTotalOnSiteTonight } from "./statsControllers.js";

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
  )
}
