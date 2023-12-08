export type ValidationRule = {
  type: "number" | "string" | "boolean" | "date" | "array";
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
    type: "number",
    min: 0,
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
    type: "number",
    min: 0,
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
    maxLength: 5000,
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
    type: "number",
    min: 0,
  },
  take: {
    type: "number",
    min: 1,
  },
  skip: {
    type: "number",
    min: 0,
  },
  id: {
    type: "number",
    min: 0,
  },
  leadGuestId: {
    type: "number",
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
  city: {
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
    type: "number",
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
    type: "number",
    minLength: 0,
  },
  paymentMethod: {
    type: "string",
    minLength: 0,
    maxLength: 100,
    validEnum: ["CASH", "CARD"]
  },
  paymentDate: {
    type: "date",
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
    type: "number",
    min: 0,
  },
};
