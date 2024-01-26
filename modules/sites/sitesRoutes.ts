import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { createSite, getSites } from "./sitesControllers.js";

export function registerSiteRoutes() {
  app.get(urls.SITES, validateProvidedData, loggedIn, getSites);
  app.post(urls.NEW_SITE, validateProvidedData, loggedIn, createSite);
}
