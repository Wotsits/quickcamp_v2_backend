import { Request, Response } from "express";
import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getTenantById } from "./tenantsControllers.js";

export function registerTenantRoutes() {
  app.get(urls.TENANTS, validateProvidedData, loggedIn);
  app.get(`${urls.TENANTS}/:id`, loggedIn, getTenantById);
}
