import { toOrdinal } from '~src/lib/functions/string/toOrdinal.ts';
import type { PositionalArgumentDef, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { toOptionName } from '~src/parseCliArgs/formatters/toOptionName.ts';

function validateDefaultAndRequired(positionalArgDefs: PositionalArgumentDef[]): ValidationException[] {
  return positionalArgDefs.reduce((accExceptions, argDef, i) => {
    if (argDef.required && argDef.defaultValue !== undefined) {
      return [
        ...accExceptions,
        {
          level: 'error',
          message: 'Invalid definition: An option cannot be required and have default value',
          identifiers: [toOptionName(argDef, i)],
        },
      ];
    }
    return accExceptions;
  }, [] as ValidationException[]);
}

function validateRequiredBeforeOptional(positionalArgDefs: PositionalArgumentDef[]): ValidationException[] {
  let previousArgIsOptional = false;
  for (let i = 0; i < positionalArgDefs.length; i += 1) {
    const argDef = positionalArgDefs[i];
    if (!argDef?.required) {
      previousArgIsOptional = true;
    } else {
      if (previousArgIsOptional) {
        const previousOrdinal = toOrdinal(i);
        const currentOrdinal = toOrdinal(i + 1);
        return [
          {
            level: 'error',
            message: `Invalid definitions: Required args must precede optional args (the ${previousOrdinal} is optional, but the ${currentOrdinal} is required)`,
            identifiers: [toOptionName(argDef)],
          },
        ];
      }
    }
  }
  return [];
}

/* TODO: Check that `defaultValue` and `validValues` are consistent. */
/* TODO: Check that `defaultValue` and `valueType` are consistent. */
/* TODO: Check that `validValues` and `valueType` are consistent. */

export function validatePositionalArgDefs(positionalArgDefs: PositionalArgumentDef[]): ValidationException[] {
  return [...validateDefaultAndRequired(positionalArgDefs), ...validateRequiredBeforeOptional(positionalArgDefs)];
}
