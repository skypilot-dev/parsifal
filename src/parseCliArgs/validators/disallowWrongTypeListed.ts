import { ArgumentDefinition, ValidationException } from '../_types';
import { hasCorrectType } from './hasCorrectType';

export function disallowWrongTypeListed(
  argDefs: ArgumentDefinition[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    const { name, validValues, valueType } = argDef;
    if (
      validValues === undefined
      || valueType === undefined
      || validValues.every(value => hasCorrectType(valueType, value))
    ) {
      return accExceptions;
    }
    return [
      ...accExceptions,
      {
        code: 'badDefinition',
        level: 'error',
        message: `Bad definition for ${name}: validValues must be of ${valueType} type`,
        identifiers: [name],
      },
    ];
  }, [] as ValidationException[]);
}
