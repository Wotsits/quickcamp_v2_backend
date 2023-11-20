import { PrismaClient } from "@prisma/client";

export const urls: { [key: string]: string } = {
  TENANTS: "/tenants",
  SITES: "/sites",
  LOGIN: "/login",
  REGISTER: "/register",
  UNITTYPES: "/unit-types",
  AVAILABLE_UNITS: "/available-units",
  LEADGUESTS: "/lead-guests",
  VEHICLES: "/vehicles",
  PETS: "/pets",
  BOOKINGS_BY_SITE: "/bookings-by-site",
  BOOKINGS_BY_SITE_AND_DATE_RANGE: "/bookings-by-site-and-date-range",
  BOOKING_BY_ID: "/booking-by-id",
  NEW_BOOKING: "/new-booking",
  PAYMENTS: "/payments",
  EXTRATYPES: "/extra-types",
  ARRIVALS_BY_DATE: "/arrivals-by-date",
  CHECK_IN_GUEST: "/check-in-guest",
  CHECK_IN_MANY_GUESTS: "/check-in-many-guests",
  FEECALCS: "/get-fee-calc",
};
