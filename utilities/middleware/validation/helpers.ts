import { ValidationRule, ValidationRules } from "./validationRules";

function validateValue(value: any, rule: ValidationRule): boolean {
  switch (rule.type) {
    case 'int':
      if (isNaN(value)) return false
      if (rule!.min !== undefined && value < rule!.min) return false
      if (rule!.max !== undefined && value > rule!.max) return false
      return true
    case 'float':
      if (typeof value !== "number") return false
      if (rule!.min !== undefined && value < rule!.min) return false
      if (rule!.max !== undefined && value > rule!.max) return false
      return true
    case 'boolean':
      if (value !== true && value !== false && value !== "true" && value !== "false") return false
      return true
    case 'string':
      if (typeof value !== "string") return false
      if (rule!.minLength && value.length < rule!.minLength) return false
      if (rule!.maxLength && value.length > rule!.maxLength) return false
      if (rule!.validEnum && !rule!.validEnum.includes(value)) return false
      return true
    case 'date':
      if (new Date(value).toString() === "Invalid Date") return false
      return true
    case 'array':
      if (!Array.isArray(value)) return false
      if (rule!.minLength !== undefined && value.length < rule!.minLength) return false
      if (rule!.maxLength !== undefined && value.length > rule!.maxLength) return false
      return true
    case 'any':
      return true;
    default:
      return true;
  }
}

export function validateObj(dataObj: any, validationRules?: ValidationRules, rule?: ValidationRule): any {

  console.log("dataObj", dataObj)

  const results: boolean[] = [];

  for (const key in dataObj) {
    const value = dataObj[key];
    if (value === undefined) {
      console.log(`value is undefined for key: ${key}`)
      return false
    }
    const ruleObj = rule || validationRules![key];
    if (!ruleObj) {
      console.log(`ruleObj is undefined for key: ${key}`)
      return false
    }
    const governsChildren = ruleObj.governChildren;

    if (Array.isArray(value)) {
      for (const arrVal of value) {
        if (typeof arrVal !== 'object') {
          results.push(validateValue(arrVal, ruleObj))
        }
        else {
          results.push(validateObj(arrVal, governsChildren ? undefined : validationRules, governsChildren ? ruleObj : undefined))
        }
      }
    }
    else if (typeof value !== 'object') {
      results.push(validateValue(value, ruleObj))
    }
    else {
      results.push(validateObj(value, governsChildren ? undefined : validationRules, governsChildren ? ruleObj : undefined))
    }
  }

  return !results.includes(false)

}