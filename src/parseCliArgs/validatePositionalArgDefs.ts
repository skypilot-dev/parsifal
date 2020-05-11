import { toOrdinal } from 'src/lib/functions/string/toOrdinal';
import { PositionalArgumentDef, ValidationException } from './_types';
import { toOptionName } from './toOptionName';

function validateRequiredBeforeOptional(
  positionalArgDefs: PositionalArgumentDef[]
): ValidationException[] {
  let previousArgIsOptional = false;
  for (let i = 0; i < positionalArgDefs.length; i += 1) {
    const argDef = positionalArgDefs[i];
    if (!argDef?.required) {
      previousArgIsOptional = true;
    } else {
      if (previousArgIsOptional) {
        const previousOrdinal = toOrdinal(i);
        const currentOrdinal = toOrdinal(i + 1);
        return [{
          level: 'error',
          message: `Invalid definitions: Required args must precede optional args (the ${previousOrdinal} is optional, but the ${currentOrdinal} is required)`,
          identifiers: [toOptionName(argDef)],
        }];
      }
    }
  }
  return [];
}

export function validatePositionalArgDefs(
  positionalArgDefs: PositionalArgumentDef[]
): ValidationException[] {
  return [
    ...validateRequiredBeforeOptional(positionalArgDefs),
  ];
}
