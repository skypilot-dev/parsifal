import { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';

export function validateRange(
  value: ArgumentValue, argDef: ArgumentDefinition,
): ValidationException[] {
  if (value === undefined) {
    /* An undefined value, if not permitted, will be flagged as a missing required value,
       so it isn't reported as an exception here. */
    return [];
  }

  const { validRange } = argDef;

  if (!validRange) {
    return [];
  }

  if (validRange.length !== 2) {
    throw new Error(`Invalid range: ${validRange}`);
  }

  const [minValue, maxValue] = validRange;
  if (value >= minValue && value <= maxValue) {
    return [];
  }

  return [{
    code: 'outOfRangeValue',
    level: 'error',
    message: `Invalid value for '${argDef.name}': Valid range is ${minValue}-${maxValue}`,
    identifiers: [argDef.name],
  }];
}
