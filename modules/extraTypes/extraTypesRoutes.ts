import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getExtraTypes } from "./extraTypesControllers.js";

export function registerExtraTypeRoutes() {
  app.get(
    urls.EXTRATYPES,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getExtraTypes
  );
}
