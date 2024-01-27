import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getUnitTypeById, getUnitTypes } from "./unitTypesControllers.js";

export function registerUnitTypeRoutes() {
  app.get(
    `${urls.UNIT_TYPES}`,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getUnitTypes
  );
  app.get(`${urls.UNITTYPES}/:id`, loggedIn, getUnitTypeById);
}
