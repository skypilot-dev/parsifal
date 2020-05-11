import { ArgumentDef, ValidationException } from './_types';

function isValidConstrainedValue<T>(validValues: T[], value: T | undefined): boolean {
  return value !== undefined && validValues.includes(value);
}

export function validateConstrainedValue<T>(
  value: T | undefined, argDef: ArgumentDef<T>,
): ValidationException | null {
  if (value === undefined) {
    /* An undefined value, if not permitted, will be flagged as a missing required value,
       so it isn't reported as an exception here. */
    return null;
  }
  if (argDef.validValues?.length) {
    if (!isValidConstrainedValue(argDef.validValues, value)) {
      return {
        level: 'error',
        message: `Invalid value for '${argDef.name}': Expected one of ${
          argDef.validValues.map(validValue => `'${validValue}'`).join(' | ')
        }, got '${value}'`,
        identifiers: [`'${argDef.name}'`],
      };
    }
  }
  return null;
}
