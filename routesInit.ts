import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import {
  registerLoginRoute,
  registerLogoutRoute,
  registerRegisterRoute,
  registerTokenRoute,
} from "./modules/auth/authRoutes.js";
import { registerTenantRoutes } from "./modules/tenants/tenantsRoutes.js";
import { registerSiteRoutes } from "./modules/sites/sitesRoutes.js";
import { registerUnitTypeRoutes } from "./modules/unitTypes/unitTypesRoutes.js";
import { registerUnitRoutes } from "./modules/units/unitsRoutes.js";
import { registerLeadGuestRoutes } from "./modules/leadGuests/leadGuestsRoutes.js";
import { registerBookingRoutes } from "./modules/bookings/bookingsRoutes.js";
import { registerPaymentRoutes } from "./modules/payments/paymentsRoutes.js";
import { registerExtraTypeRoutes } from "./modules/extraTypes/extraTypesRoutes.js";
import { registerArrivalsRoutes, registerCheckInRoutes } from "./modules/arrivals/arrivalsRoutes.js";
import { registerGuestTypeRoutes } from "./modules/guestTypes/guestTypesRoutes.js";
import { registerEquipmentTypeRoutes } from "./modules/equipmentTypes/equipmentTypesRoutes.js";
import { registerUserRoutes } from "./modules/users/usersRoutes.js";
import { registerCheckOutRoutes, registerDeparturesRoutes } from "./modules/departures/departuresRoutes.js";
import { registerStatsRoutes } from "./modules/stats/statsRoutes.js";
import { registerNoteRoutes } from "./modules/notes/notesRoutes.js";
import { registerRatesRoutes } from "./modules/rates/ratesRoutes.js";

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
  registerUserRoutes(app, prisma);
  registerStatsRoutes(app, prisma);
  registerNoteRoutes(app, prisma);
  registerRatesRoutes(app, prisma);
}
