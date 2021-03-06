import { MaybeReadOnlyArray } from '@skypilot/common-types';
import { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';

function isValidConstrainedValue<T>(validValues: MaybeReadOnlyArray<T>, value: T | undefined): boolean {
  return value !== undefined && validValues.includes(value);
}

export function validateConstrainedValue(
  value: ArgumentValue, argDef: ArgumentDefinition,
): ValidationException[] {
  if (value === undefined) {
    /* An undefined value, if not permitted, will be flagged as a missing required value,
       so it isn't reported as an exception here. */
    return [];
  }
  if (argDef.validValues?.length) {
    if (!isValidConstrainedValue(argDef.validValues, value)) {
      return [{
        code: 'unlistedValue',
        level: 'error',
        message: `Invalid value for '${argDef.name}': Expected one of ${
          argDef.validValues.map((validValue) => `'${validValue}'`).join(' | ')
        }, got '${value}'`,
        identifiers: [argDef.name],
      }];
    }
  }
  return [];
}
