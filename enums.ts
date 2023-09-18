import { PrismaClient } from "@prisma/client";

export const urls: { [key: string]: string } = {
  TENANTS: "/tenants",
  SITES: "/sites",
  LOGIN: "/login",
  REGISTER: "/register",
  UNITTYPES: "/unit-types",
  UNITS: "/units",
  GUESTS: "/guests",
  VEHICLES: "/vehicles",
  PETS: "/pets",
  BOOKINGS: "/bookings",
  PAYMENTS: "/payments",
};

export const entityTypes: { [key: string]: keyof PrismaClient } = {
  TENANT: "tenant",
  SITE: "site",
  UNITTYPE: "unitType",
  UNIT: "unit",
  BOOKING: "booking",
  PAYMENT: "payment",
};
