import { BOOKING_STATUSES } from "../../../enums.js";
import { maxPageLength } from "../../../settings.js";

export type ValidationRule = {
  type: "int" | "float" | "string" | "boolean" | "date" | "array" | "any";
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  validEnum?: string[];
};

export type ValidationRules = {
  [key: string]: ValidationRule;
};

export const validationRulesMap: ValidationRules = {
  siteId: {
    type: "int",
    min: 1,
  },
  siteName: {
    type: "string",
    minLength: 0,
    maxLength: 50,
  },
  siteUrl: {
    type: "string",
    minLength: 0,
    maxLength: 50,
  },
  siteDescription: {
    type: "string",
    minLength: 0,
    maxLength: 500,
  },
  date: {
    type: "date",
  },
  username: {
    type: "string",
    minLength: 1,
    maxLength: 100,
  },
  password: {
    type: "string",
    minLength: 1,
    maxLength: 500,
  },
  tenantId: {
    type: "int",
    min: 1,
  },
  name: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  email: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  role: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  token: {
    type: "string",
    minLength: 0,
    maxLength: 10000,
  },
  startDate: {
    type: "date",
  },
  endDate: {
    type: "date",
  },
  start: {
    type: "date",
  },
  end: {
    type: "date",
  },
  equipmentTypeId: {
    type: "int",
    min: 1,
  },
  take: {
    type: "int",
    min: 1,
    max: maxPageLength
  },
  skip: {
    type: "int",
    min: 0,
  },
  id: {
    type: "int",
    min: 0,
  },
  leadGuestId: {
    type: "int",
    min: 0,
  },
  firstName: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  lastName: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  tel: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  address1: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  address2: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  townCity: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  county: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  postcode: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  country: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  unitId: {
    type: "int",
    min: 0,
  },
  extras: {
    type: "array",
    minLength: 0,
    maxLength: 5000,
  },
  bookingGuests: {
    type: "array",
    minLength: 0,
  },
  bookingPets: {
    type: "array",
    minLength: 0,
  },
  bookingVehicles: {
    type: "array",
    minLength: 0,
  },
  paymentAmount: {
    type: "int",
    minLength: 0,
  },
  paymentMethod: {
    type: "string",
    minLength: 0,
    maxLength: 100,
    validEnum: ["CASH", "CARD", "BANK TRANSFER"]
  },
  paymentDate: {
    type: "date",
  },
  bookingGroupId: {
    type: "int",
    minLength: 0,
    min: 0
  },
  reverse: {
    type: "boolean",
  },
  type: {
    type: "string",
    minLength: 0,
    maxLength: 100,
    validEnum: ["GUEST", "PET", "VEHICLE"],
  },
  guests: {
    type: "array",
    minLength: 0,
  },
  includeSite: {
    type: "boolean",
  },
  includeUnitTypes: {
    type: "boolean",
  },
  includeUnits: {
    type: "boolean",
  },
  unitTypeId: {
    type: "int",
    min: 0,
  },
  q: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  bookingId: {
    type: "int",
    min: 0,
  },
  paymentId: {
    type: "int",
    min: 0,
  },
  bookingGuestId: {
    type: "int",
    min: 0,
  },
  bookingPetId: {
    type: "int",
    min: 0,
  },
  bookingVehicleId: {
    type: "int",
    min: 0,
  },
  content: {
    type: "string",
    minLength: 0,
    maxLength: 5000,
  },
  noteType: {
    type: "string",
    minLength: 0,
    validEnum: ["PUBLIC", "PRIVATE"],
  },
  description: {
    type: "string",
    minLength: 0,
    maxLength: 500,
  },
  website: {
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  status: {
    type: "string",
    validEnum: [BOOKING_STATUSES.CONFIRMED, BOOKING_STATUSES.UNCONFIRMED, BOOKING_STATUSES.CANCELLED],
  },
  latitude: {
    type: "int",
    min: -90,
    max: 90,
  },
  longitude: {
    type: "int",
    min: -180,
    max: 180,
  },
  includeRates: {
    type: "boolean",
  },
  changedItems: {
    type: "array",
    minLength: 1,
  },
  include: {
    type: "boolean"
  },
  summariesOnly: {
    type: "boolean"
  },
  count: {
    type: "boolean"
  },
  OR: {
    type: "any"
  },
  AND: {
    type: "any"
  }
};
