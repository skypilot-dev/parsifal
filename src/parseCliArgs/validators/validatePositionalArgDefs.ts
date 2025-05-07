import { toOrdinal } from '~src/lib/functions/string/toOrdinal.ts';
import type { PositionalArgumentDef, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { toOptionName } from '~src/parseCliArgs/formatters/toOptionName.ts';

function validateDefaultAndRequired(positionalArgDefs: PositionalArgumentDef[]): ValidationException[] {
  return positionalArgDefs.reduce<ValidationException[]>((accExceptions, argDef, i) => {
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
  }, []);
}

function validateRequiredBeforeOptional(positionalArgDefs: PositionalArgumentDef[]): ValidationException[] {
  let previousArgIsOptional = false;
  for (const [i, argDef] of positionalArgDefs.entries()) {
    if (argDef.required) {
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
    } else {
      previousArgIsOptional = true;
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
