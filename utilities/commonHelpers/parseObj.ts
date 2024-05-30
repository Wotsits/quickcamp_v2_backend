import { ValidationRule, ValidationRules } from "../middleware/validation/validationRules";

function parseValue(value: any, rule: ValidationRule): any {
    switch (rule.type) {
      case 'int':
        return parseInt(value)
      case 'float':
        return parseFloat(value)
      case 'boolean':
        return value === "true" || value === true ? true : false
      case 'string':
        return value.toString()
      case 'date':
        return new Date(value)
      default:
        return true;
    }
  }
  
  export function parseObj(dataObj: any, validationRules?: ValidationRules, rule?: ValidationRule): any {
    
    const parsedData: any = {};
  
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
            parsedData[key] = parseValue(arrVal, ruleObj)
          }
          else {
            parsedData[key] = parseObj(arrVal, governsChildren ? undefined : validationRules, governsChildren ? ruleObj : undefined)
          }
        }
      }
      else if (typeof value !== 'object') {
        parsedData[key] = parseValue(value, ruleObj)
      }
      else {
        parsedData[key] = parseObj(value, governsChildren ? undefined : validationRules, governsChildren ? ruleObj : undefined)
      }
    }
  
    return parsedData
  
  }