import type { ArgumentDefinition, ValidationException } from '../_types';
import { hasCorrectType } from './hasCorrectType';
import { parseBaseType } from './parseBaseType';

export function disallowWrongTypeListed(
  argDefs: ArgumentDefinition[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    const { name, validValues, valueType } = argDef;

    if (typeof validValues === 'undefined' || typeof valueType === 'undefined') {
      return accExceptions;
    }

    const baseType = parseBaseType(valueType);
    if (validValues.every(value => hasCorrectType(baseType, value))) {
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
