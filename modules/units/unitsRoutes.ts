import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getAvailableUnits } from "./unitsControllers.js";

export function registerUnitRoutes() {
  app.get(
    urls.AVAILABLE_UNITS,
    validateProvidedData,
    loggedIn,
    getAvailableUnits
  );
}
