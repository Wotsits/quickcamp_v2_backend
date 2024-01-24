import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import {
  registerLoginRoute,
  registerLogoutRoute,
  registerRegisterRoute,
  registerTokenRoute,
} from "./features/auth/authRoutes.js";
import { registerTenantRoutes } from "./features/tenants/tenantsRoutes.js";
import { registerSiteRoutes } from "./features/sites/sitesRoutes.js";
import { registerUnitTypeRoutes } from "./features/unitTypes/unitTypesRoutes.js";
import { registerUnitRoutes } from "./features/units/unitsRoutes.js";
import { registerLeadGuestRoutes } from "./features/leadGuests/leadGuestsRoutes.js";
import { registerBookingRoutes } from "./features/bookings/bookingsRoutes.js";
import { registerPaymentRoutes } from "./features/payments/paymentsRoutes.js";
import { registerExtraTypeRoutes } from "./features/extraTypes/extraTypesRoutes.js";
import { registerArrivalsRoutes, registerCheckInRoutes } from "./features/arrivals/arrivalsRoutes.js";
import { registerGuestTypeRoutes } from "./features/guestTypes/guestTypesRoutes.js";
import { registerEquipmentTypeRoutes } from "./features/equipmentTypes/equipmentTypesRoutes.js";
import { registerUserRoutes } from "./features/users/usersRoutes.js";
import { registerCheckOutRoutes, registerDeparturesRoutes } from "./features/departures/departuresRoutes.js";
import { registerStatsRoutes } from "./features/stats/statsRoutes.js";
import { registerNoteRoutes } from "./features/notes/notesRoutes.js";
import { registerRatesRoutes } from "./features/rates/ratesRoutes.js";

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
