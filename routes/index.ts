import { Express, Request, Response } from "express";
import { getAll } from "../dataFetchers/getAll.js";
import { getOneById } from "../dataFetchers/getOneById.js";
import { Booking, PrismaClient } from "@prisma/client";
import {
  registerLoginRoute,
  registerLogoutRoute,
  registerRegisterRoute,
  registerTokenRoute,
} from "./auth.js";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";
import { registerTenantRoutes } from "./tenants.js";
import { registerSiteRoutes } from "./sites.js";
import { registerUnitTypeRoutes } from "./unitTypes.js";
import { registerUnitRoutes } from "./units.js";
import { registerGuestRoutes } from "./guests.js";
import { registerVehicleRoutes } from "./vehicles.js";
import { registerPetRoutes } from "./pets.js";
import { registerBookingRoutes } from "./bookings.js";
import { registerPaymentRoutes } from "./payments.js";

export function routesInit(app: Express, prisma: PrismaClient) {
  registerRegisterRoute(app, prisma);
  registerLoginRoute(app, prisma);
  registerTokenRoute(app, prisma);
  registerLogoutRoute(app, prisma);
  registerTenantRoutes(app, prisma);
  registerSiteRoutes(app, prisma);
  registerUnitTypeRoutes(app, prisma);
  registerUnitRoutes(app, prisma);
  registerGuestRoutes(app, prisma);
  registerVehicleRoutes(app, prisma);
  registerPetRoutes(app, prisma);
  registerBookingRoutes(app, prisma);
  registerPaymentRoutes(app, prisma);
}
