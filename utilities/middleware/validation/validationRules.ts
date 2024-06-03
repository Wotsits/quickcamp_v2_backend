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
    governChildren: true,
    type: "int",
    min: 1,
  },
  siteName: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 50,
  },
  siteUrl: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 50,
  },
  siteDescription: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 500,
  },
  username: {
    governChildren: true,
    type: "string",
    minLength: 1,
    maxLength: 100,
  },
  password: {
    governChildren: true,
    type: "string",
    minLength: 1,
    maxLength: 500,
  },
  tenantId: {
    governChildren: true,
    type: "int",
    min: 1,
  },
  name: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  email: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  role: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  token: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 10000,
  },
  start: {
    governChildren: true,
    type: "date",
  },
  end: {
    governChildren: true,
    type: "date",
  },
  startDate: {
    governChildren: true,
    type: "date",
  },
  endDate: {
    governChildren: true,
    type: "date",
  },
  date: {
    governChildren: true,
    type: "date",
  },
  equipmentTypeId: {
    governChildren: true,
    type: "int",
    min: 1,
  },
  take: {
    governChildren: true,
    type: "int",
    min: 1,
    max: maxPageLength
  },
  skip: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  id: {
    governChildren: true,
    type: "int",
    min: -1,
  },
  leadGuestId: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  firstName: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  lastName: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  tel: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  address1: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  address2: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  townCity: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  county: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  postcode: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  country: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  unitId: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  extras: {
    governChildren: true,
    type: "int",
    minLength: 0,
    maxLength: 5000,
  },
  bookingGuests: {
    governChildren: false,
    type: "array",
    minLength: 0,
  },
  paymentAmount: {
    governChildren: true,
    type: "int",
    minLength: 0,
  },
  paymentMethod: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
    validEnum: ["CASH", "CARD", "BANK TRANSFER"]
  },
  paymentDate: {
    governChildren: true,
    type: "date",
  },
  bookingGroupId: {
    governChildren: true,
    type: "int",
    minLength: 0,
    min: 0
  },
  reverse: {
    governChildren: true,
    type: "boolean",
  },
  type: {
    governChildren: true,
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
    governChildren: true,
    type: "boolean",
  },
  includeUnitTypes: {
    governChildren: true,
    type: "boolean",
  },
  includeUnits: {
    governChildren: true,
    type: "boolean",
  },
  unitTypeId: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  guestTypeId: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  q: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  bookingId: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  paymentId: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  bookingGuestId: {
    governChildren: true,
    type: "int",
    min: 0,
  },
  content: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 5000,
  },
  noteType: {
    governChildren: true,
    type: "string",
    minLength: 0,
    validEnum: ["PUBLIC", "PRIVATE"],
  },
  description: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 500,
  },
  website: {
    governChildren: true,
    type: "string",
    minLength: 0,
    maxLength: 100,
  },
  status: {
    governChildren: true,
    type: "string",
    validEnum: [BOOKING_STATUSES.CONFIRMED, BOOKING_STATUSES.UNCONFIRMED, BOOKING_STATUSES.CANCELLED],
  },
  latitude: {
    governChildren: true,
    type: "int",
    min: -90,
    max: 90,
  },
  longitude: {
    governChildren: true,
    type: "int",
    min: -180,
    max: 180,
  },
  includeRates: {
    governChildren: true,
    type: "boolean",
  },
  changedItems: {
    governChildren: true,
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
