import { ValidationRule } from "./validationRules";

export function validate(paramValue: any, validationRule: ValidationRule) {
    const { type, min, max, minLength, maxLength } = validationRule;
  
    if (type === "number") {
      const paramValueAsNumber = Number(paramValue);
      if (isNaN(paramValueAsNumber)) {
        return false;
      }
      if (min && paramValueAsNumber < min) {
        return false;
      }
      if (max && paramValueAsNumber > max) {
        return false;
      }
    }
  
    if (type === "boolean") {
      if (paramValue !== "true" && paramValue !== "false") {
        return false;
      }
    }
  
    if (type === "string") {
      if (typeof paramValue !== "string") {
        return false;
      }
      if (minLength && paramValue.length < minLength) {
        return false;
      }
      if (maxLength && paramValue.length > maxLength) {
        return false;
      }
    }
  
    return true;
  }