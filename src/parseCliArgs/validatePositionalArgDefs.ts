import { Integer } from '@skypilot/common-types';
import { PositionalArgumentDef, ValidationException } from './_types';

function toOrdinal(int: Integer): string {
  const modulus = int % 10;
  const endingsMap = {
    0: 'th',
    1: 'st',
    2: 'nd',
    3: 'rd',
  } as { [key: number]: string };
  const ending = [1, 2, 3].includes(modulus) ? endingsMap[modulus] : endingsMap[0];
  return `${int}${ending}`;
}

export function validatePositionalArgDefs(
  positionalArgDefs: Array<PositionalArgumentDef | string>
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
