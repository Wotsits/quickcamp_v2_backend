import { NextFunction, Request, Response } from "express";
import { validationRulesMap } from "./validationRules.js";
import { validateObj } from "./helpers.js";

type ReqKey = "params" | "body" | "query";

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

  const queue = [req.params, req.body, req.query]
  
  const results: boolean[] = []

  queue.forEach((item, index) => {
    results.push(validateObj(item, validationRulesMap))
  })

  console.log("results in validateProvidedData: ", results)

  if (results.includes(false)) {
    return res.status(400).json({
      message: "Bad request - invalid data",
    });
  }
  else (
    next()
  )
}

// ----------------
