import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import {
  registerLoginRoute,
  registerLogoutRoute,
  registerRegisterRoute,
  registerTokenRoute,
} from "./auth.js";
import { registerTenantRoutes } from "./tenants.js";
import { registerSiteRoutes } from "./sites.js";
import { registerUnitTypeRoutes } from "./unitTypes.js";
import { registerUnitRoutes } from "./units.js";
import { registerLeadGuestRoutes } from "./leadGuests.js";
import { registerVehicleRoutes } from "./vehicles.js";
import { registerPetRoutes } from "./pets.js";
import { registerBookingRoutes } from "./bookings.js";
import { registerPaymentRoutes } from "./payments.js";
import { registerExtraTypeRoutes } from "./extraTypes.js";
import { registerArrivalsRoutes } from "./arrivals.js";

export function routesInit(app: Express, prisma: PrismaClient) {
  registerRegisterRoute(app, prisma);
  registerLoginRoute(app, prisma);
  registerTokenRoute(app, prisma);
  registerLogoutRoute(app, prisma);
  registerTenantRoutes(app, prisma);
  registerSiteRoutes(app, prisma);
  registerUnitTypeRoutes(app, prisma);
  registerUnitRoutes(app, prisma);
  registerExtraTypeRoutes(app, prisma);
  registerLeadGuestRoutes(app, prisma);
  registerVehicleRoutes(app, prisma);
  registerPetRoutes(app, prisma);
  registerBookingRoutes(app, prisma);
  registerArrivalsRoutes(app, prisma);
  registerPaymentRoutes(app, prisma);
}
