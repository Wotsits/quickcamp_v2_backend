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
import { registerCheckInRoutes } from "./modules/bookingGuests/bookingGuestsRoutes.js";
import { registerGuestTypeRoutes } from "./modules/guestTypes/guestTypesRoutes.js";
import { registerEquipmentTypeRoutes } from "./modules/equipmentTypes/equipmentTypesRoutes.js";
import { registerUserRoutes } from "./modules/users/usersRoutes.js";
import { registerCheckOutRoutes } from "./modules/bookingGuests/bookingGuestsRoutes.js";
import { registerStatsRoutes } from "./modules/stats/statsRoutes.js";
import { registerNoteRoutes } from "./modules/notes/notesRoutes.js";
import { registerRatesRoutes } from "./modules/rates/ratesRoutes.js";
import { registerBookingGroupRoutes } from "./modules/bookingGroups/bookingGroupRoutes.js";

export function routesInit() {
  registerRegisterRoute();
  registerLoginRoute();
  registerTokenRoute();
  registerLogoutRoute();
  registerTenantRoutes();
  registerSiteRoutes();
  registerUnitTypeRoutes();
  registerEquipmentTypeRoutes();
  registerGuestTypeRoutes();
  registerUnitRoutes();
  registerExtraTypeRoutes();
  registerLeadGuestRoutes();
  registerBookingGroupRoutes();
  registerBookingRoutes();
  registerCheckInRoutes();
  registerCheckOutRoutes();
  registerPaymentRoutes();
  registerUserRoutes();
  registerStatsRoutes();
  registerNoteRoutes();
  registerRatesRoutes();
}
