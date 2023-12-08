import { NextFunction, Request, Response } from "express";
import { validationRulesMap } from "./validationRules.js";
import { validate } from "./helpers.js";

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
  // this object contains the params, body, and query object keys
  const obj: {
    [key: string]: string[];
  } = {
    params: Object.keys(req.params),
    body: Object.keys(req.body),
    query: Object.keys(req.query),
  };

  // this array contains the params, body, and query object keys
  const queue = Object.keys(obj) as ReqKey[];

  let issues: {
    paramsBodyOrQuery: ReqKey;
    key: string;
    value: any;
    cause: "NO_RULE_SPECIFIED" | "FAILED_VALIDATION_AGAINST_RULE";
  }[] = [];

  // iterate over the queue
  queue.forEach(async (queueItem) => {
    const queueItemNames = obj[queueItem];
    // iterate over the params, body, and query object keys
    queueItemNames.forEach((queueItemName) => {
      const validationRule = validationRulesMap[queueItemName];
      const queueItemValue = req[queueItem][queueItemName];

      // if there is no validation rule for the queueItemName, return a 400
      if (!validationRule) {
        issues.push({
          paramsBodyOrQuery: queueItem as ReqKey,
          key: queueItemName,
          value: queueItemValue,
          cause: "NO_RULE_SPECIFIED",
        });
      }
      // if there is a validation rule for the queueItemName, validate the queueItemValue against the validation rule
      else {
        const isValid = validate(queueItemValue, validationRule);
        if (!isValid) {
          issues.push({
            paramsBodyOrQuery: queueItem as ReqKey,
            key: queueItemName,
            value: queueItemValue,
            cause: "FAILED_VALIDATION_AGAINST_RULE",
          });
        }
      }
    });
  });

  // if there are no issues, call next()
  if (issues.length === 0) next();
  // if there are issues, return a 400
  else {
    // print each validation issue to the console
    issues.forEach(({ paramsBodyOrQuery, key, value, cause }) =>
      console.warn(
        `Validation of user input failed.  Issue in ${paramsBodyOrQuery} at key ${key}.  Cause of issue is ${cause}.  The supplied value was: ${value}`
      )
    );
    return res
      .status(400)
      .json({
        message: `Invalid ${issues[0].paramsBodyOrQuery} ${issues[0].key}`,
      });
  }
}

// ----------------
