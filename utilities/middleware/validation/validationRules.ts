import { BOOKING_STATUSES } from "../../../enums.js";
import { maxPageLength } from "../../../settings.js";

export type ValidationRule = {
  governChildren: boolean;
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
    governChildren: false,
    type: "int",
    min: 1,
  },
  siteName: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 50,
  },
  siteUrl: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 50,
  },
  siteDescription: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 500,
  },
  username: {
    governChildren: false,
    type: "string",
    minLength: 1,
    maxLength: 100,
  },
  password: {
    governChildren: false,
    type: "string",
    minLength: 1,
    maxLength: 500,
  },
  tenantId: {
    governChildren: false,
    type: "int",
    min: 1,
  },
  name: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  email: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  role: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  token: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 10000,
  },
  start: {
    governChildren: false,
    type: "date",
  },
  end: {
    governChildren: false,
    type: "date",
  },
  date: {
    governChildren: false,
    type: "date",
  },
  equipmentTypeId: {
    governChildren: false,
    type: "int",
    min: 1,
  },
  take: {
    governChildren: false,
    type: "int",
    min: 1,
    max: maxPageLength
  },
  skip: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  id: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  leadGuestId: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  firstName: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  lastName: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  tel: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  address1: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  address2: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  townCity: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  county: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  postcode: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  country: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  unitId: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  extras: {
    governChildren: false,
    type: "array",
    minLength: 0,
    maxLength: 5000,
  },
  bookingGuests: {
    governChildren: false,
    type: "array",
    minLength: 0,
  },
  paymentAmount: {
    governChildren: false,
    type: "int",
    minLength: 0,
  },
  paymentMethod: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
    validEnum: ["CASH", "CARD", "BANK TRANSFER"]
  },
  paymentDate: {
    governChildren: false,
    type: "date",
  },
  bookingGroupId: {
    governChildren: false,
    type: "int",
    minLength: 0,
    min: 0
  },
  reverse: {
    governChildren: false,
    type: "boolean",
  },
  type: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
    validEnum: ["GUEST", "PET", "VEHICLE"],
  },
  guests: {
    governChildren: false,
    type: "any",
    minLength: 0,
  },
  includeSite: {
    governChildren: false,
    type: "boolean",
  },
  includeUnitTypes: {
    governChildren: false,
    type: "boolean",
  },
  includeUnits: {
    governChildren: false,
    type: "boolean",
  },
  unitTypeId: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  q: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  bookingId: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  paymentId: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  bookingGuestId: {
    governChildren: false,
    type: "int",
    min: 0,
  },
  content: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 5000,
  },
  noteType: {
    governChildren: false,
    type: "string",
    minLength: 0,
    validEnum: ["PUBLIC", "PRIVATE"],
  },
  description: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 500,
  },
  website: {
    governChildren: false,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  status: {
    governChildren: false,
    type: "string",
    validEnum: [BOOKING_STATUSES.CONFIRMED, BOOKING_STATUSES.UNCONFIRMED, BOOKING_STATUSES.CANCELLED],
  },
  latitude: {
    governChildren: false,
    type: "int",
    min: -90,
    max: 90,
  },
  longitude: {
    governChildren: false,
    type: "int",
    min: -180,
    max: 180,
  },
  includeRates: {
    governChildren: false,
    type: "boolean",
  },
  changedItems: {
    governChildren: false,
    type: "array",
    minLength: 1,
  },
  include: {
    governChildren: true,
    type: "boolean"
  },
  summariesOnly: {
    governChildren: false,
    type: "boolean"
  },
  count: {
    governChildren: false,
    type: "boolean"
  },
  OR: {
    governChildren: false,
    type: "any"
  },
  AND: {
    governChildren: false,
    type: "any"
  },
  some: {
    governChildren: false,
    type: "any",
  },
  orderBy: {
    governChildren: true,
    type: "string",
    validEnum: ["asc", "desc"]
  }
};
