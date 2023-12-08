import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ValidationRule, validationRulesMap } from "./validationRules";
import { validate } from "./helpers";

// ----------------

dotenv.config();
const { JWTSECRET: jwtSecret } = process.env;

// ----------------

/* Herein lies the gatekeeper to the backend.  All requests which pass data via params, body, or query
 * must pass through this middleware.  This middleware will validate the data against the validationRulesMap
 * and return a 400 if the data is invalid.  The validationRulesMap is defined in validationRules.ts and contains
 * the validation rules for each param, body, or query.  The validationRulesMap is imported into this file and
 * used to validate the data.
 */
export function validateProvidedData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const paramNames = Object.keys(req.params);
  const bodyNames = Object.keys(req.body);
  const queryNames = Object.keys(req.query);

  paramNames.forEach((paramName: string) => {
    const validationRule = validationRulesMap[paramName];
    const paramValue = req.params[paramName];

    if (!validationRule) {
      console.warn(`No validation rule found for param ${paramName}`);
    } else {
      const isValid = validate(paramValue, validationRule);
      if (!isValid) {
        return res.status(400).json({ message: `Invalid param ${paramName}` });
      }
    }
  });

  bodyNames.forEach((bodyName: string) => {
    const validationRule = validationRulesMap[bodyName];
    const bodyValue = req.body[bodyName];

    if (!validationRule) {
      console.warn(`No validation rule found for body ${bodyName}`);
    } else {
      const isValid = validate(bodyValue, validationRule);
      if (!isValid) {
        return res.status(400).json({ message: `Invalid body ${bodyName}` });
      }
    }
  });

  queryNames.forEach((queryName: string) => {
    const validationRule = validationRulesMap[queryName];
    const queryValue = req.query[queryName];

    if (!validationRule) {
      console.warn(`No validation rule found for query ${queryName}`);
    } else {
      const isValid = validate(queryValue, validationRule);
      if (!isValid) {
        return res.status(400).json({ message: `Invalid query ${queryName}` });
      }
    }
  });

  next();
}

// ----------------
