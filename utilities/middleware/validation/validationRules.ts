export type ValidationRule = {
    type: "number" | "string" | "boolean";
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
}

export type ValidationRules = {
    [key: string]: ValidationRule;
}

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
};
