import { toOrdinal } from 'src/lib/functions/string/toOrdinal';
import { PositionalArgDefInput, ValidationException } from './_types';

export function validatePositionalArgDefs(
  positionalArgDefs: PositionalArgDefInput[]
): ValidationException[] {
  let previousArgIsOptional = false;
  for (let i = 0; i < positionalArgDefs.length; i += 1) {
    const argDef = positionalArgDefs[i];
    const argIsRequired = typeof argDef === 'string' ? false : argDef.required;
    if (!argIsRequired) {
      previousArgIsOptional = true;
    } else {
      if (previousArgIsOptional) {
        const previousOrdinal = toOrdinal(i);
        const currentOrdinal = toOrdinal(i + 1);
        return [{
          level: 'error',
          message: `Invalid definitions: Required args must precede optional args (the ${previousOrdinal} is optional, but the ${currentOrdinal} is required)`,
          name: typeof argDef === 'string' ? i.toString() : (argDef?.name || i.toString()),
        }];
      }
    }
  }
  return [];
}
