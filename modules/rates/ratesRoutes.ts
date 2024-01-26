import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { updateRates } from "./ratesControllers.js";

export function registerRatesRoutes() {
  app.put(
    urls.UPDATE_RATES,
    validateProvidedData,
    loggedIn,
    updateRates
  );

  // TODO - add a route to update rates for a date range
}
