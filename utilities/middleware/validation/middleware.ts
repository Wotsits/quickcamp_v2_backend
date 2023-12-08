import { NextFunction, Request, Response } from "express";
import { validationRulesMap } from "./validationRules.js";
import { validate } from "./helpers.js";

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
  // this object contains the params, body, and query object keys
  const obj: {
    [key: string]: string[];
  } = {
    params: Object.keys(req.params),
    body: Object.keys(req.body),
    query: Object.keys(req.query),
  };

  // this array contains the params, body, and query object keys
  const queue = Object.keys(obj) as ("params" | "query" | "body") [];

  // iterate over the queue
  queue.forEach((queueItem) => {
    const queueItemNames = obj[queueItem];
    // iterate over the params, body, and query object keys
    queueItemNames.forEach((queueItemName) => {
      const validationRule = validationRulesMap[queueItemName];
      const queueItemValue = req[queueItem][queueItemName];

      // if there is no validation rule for the queueItemName, return a 400
      if (!validationRule) {
        console.warn("*************************")
        console.warn("*************************")
        console.warn(
          `No validation rule found for ${queueItem} ${queueItemName}`
        );
        console.warn("*************************")
        console.warn("*************************")
        return res
          .status(400)
          .json({ message: `Invalid ${queueItem} ${queueItemName}` });
      }
      // if there is a validation rule for the queueItemName, validate the queueItemValue against the validation rule
      else {
        const isValid = validate(queueItemValue, validationRule);
        if (!isValid) {
          console.warn("*************************")
          console.warn("*************************")
          console.warn(
            `Supplied data failed validation.  In particular, ${queueItem} ${queueItemName} failed validation.`
          );
          console.warn("*************************")
          console.warn("*************************")
          return res
            .status(400)
            .json({ message: `Invalid ${queueItem} ${queueItemName}` });
        }
      }
    });
  });

  next();
}

// ----------------
