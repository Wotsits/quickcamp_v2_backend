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
import { registerUnitTypeRoutes } from "./unit-types.js";
import { registerUnitRoutes } from "./available-units.js";
import { registerLeadGuestRoutes } from "./lead-guests.js";
import { registerBookingRoutes } from "./bookings.js";
import { registerPaymentRoutes } from "./payments.js";
import { registerExtraTypeRoutes } from "./extra-types.js";
import { registerArrivalsRoutes, registerCheckInRoutes } from "./arrivals.js";
import { registerFeeCalcRoutes } from "./get-fee-calc.js";
import { registerGuestTypeRoutes } from "./guest-types.js";
import { registerEquipmentTypeRoutes } from "./equipment-types.js";
import { registerUserRoutes } from "./users.js";
import { registerCheckOutRoutes, registerDeparturesRoutes } from "./departures.js";

export function routesInit(app: Express, prisma: PrismaClient) {
  registerRegisterRoute(app, prisma);
  registerLoginRoute(app, prisma);
  registerTokenRoute(app, prisma);
  registerLogoutRoute(app, prisma);
  registerTenantRoutes(app, prisma);
  registerSiteRoutes(app, prisma);
  registerUnitTypeRoutes(app, prisma);
  registerEquipmentTypeRoutes(app, prisma);
  registerGuestTypeRoutes(app, prisma);
  registerUnitRoutes(app, prisma);
  registerExtraTypeRoutes(app, prisma);
  registerLeadGuestRoutes(app, prisma);
  registerBookingRoutes(app, prisma);
  registerArrivalsRoutes(app, prisma);
  registerCheckInRoutes(app, prisma);
  registerDeparturesRoutes(app, prisma);
  registerCheckOutRoutes(app, prisma);
  registerPaymentRoutes(app, prisma);
  registerFeeCalcRoutes(app, prisma);
  registerUserRoutes(app, prisma);
}
