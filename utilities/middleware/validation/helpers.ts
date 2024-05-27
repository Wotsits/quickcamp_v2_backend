import { ValidationRule } from "./validationRules";

export function validate(paramValue: any, validationRule: ValidationRule): boolean {
  const { type, min, max, minLength, maxLength, validEnum } = validationRule;

  // if the value is itself and object, recurse through the layers of the object to the end value.
  if (typeof paramValue === "object") {
    if (!Array.isArray(paramValue)) {
      let validState = []
      for (const subKey in paramValue) {
        const result: boolean = validate(paramValue[subKey], validationRule)
        validState.push(result)
      }
      return !validState.includes(false)
    }
  }

  if (type === "int" || type === "float") {
      const paramValueAsNumber = Number(paramValue);
      if (isNaN(paramValueAsNumber)) {
        return false;
      }
      if (min !== undefined && paramValueAsNumber < min) {
        return false;
      }
      if (max !== undefined && paramValueAsNumber > max) {
        return false;
      }
  }

  if (type === "boolean") {
    return paramValue === true || paramValue === false || paramValue === "true" || paramValue === "false";
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
    if (validEnum && !validEnum.includes(paramValue)) {
      return false;
    }
  }

  if (type === "date") {
    const paramValueAsDate = new Date(paramValue);
    if (isNaN(paramValueAsDate.getTime())) {
      return false;
    }
  }

  if (type === "array") {
    if (!Array.isArray(paramValue)) {
      return false;
    }
    if (minLength !== undefined && paramValue.length < minLength) {
      return false;
    }
  }

  return true;
}