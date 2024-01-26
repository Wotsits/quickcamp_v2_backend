import { Request, Response } from "express";
import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app, prisma } from "../../index.js";
import { getTotalOnSite } from "./statsControllers.js";

export function registerStatsRoutes() {
  app.get(
    urls.STATS + urls.ON_SITE,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getTotalOnSite
  );
}
