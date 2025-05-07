import type { ArgumentDefinition, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { hasCorrectType } from '~src/parseCliArgs/validators/hasCorrectType.ts';
import { parseBaseType } from '~src/parseCliArgs/validators/parseBaseType.ts';

export function disallowWrongTypeListed(argDefs: ArgumentDefinition[]): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    const { name, validValues, valueType } = argDef;

    if (typeof validValues === 'undefined' || typeof valueType === 'undefined') {
      return accExceptions;
    }

    const baseType = parseBaseType(valueType);
    if (validValues.every((value) => hasCorrectType(baseType, value))) {
      return accExceptions;
    }

    return [
      ...accExceptions,
      {
        code: 'badDefinition',
        level: 'error',
        message: `Bad definition for ${name}: validValues must be of ${baseType} type`,
        identifiers: [name],
      },
    ];
  }, [] as ValidationException[]);
}
