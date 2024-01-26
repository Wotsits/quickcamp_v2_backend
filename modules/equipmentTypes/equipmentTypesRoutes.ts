import { urls } from "../../enums.js";
import {
  hasAccessToRequestedSite,
  loggedIn,
} from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getEquipmentTypes } from "./equipmentTypesControllers.js";

export function registerEquipmentTypeRoutes() {
  app.get(
    `${urls.EQUIPMENT_TYPES}`,
    validateProvidedData,
    loggedIn,
    hasAccessToRequestedSite,
    getEquipmentTypes
  );
}
