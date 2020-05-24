import { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';
import { hasCorrectType } from './hasCorrectType';

export function validateTypedValue(
  value: ArgumentValue, argDef: ArgumentDefinition
): ValidationException[] {
  const { name, valueType } = argDef;
  if (!valueType) {
    return [];
  }

  if (!hasCorrectType(valueType, value)) {
    const valueString = typeof value === 'string' ? `'${value}'` : `${value}`;
    return [{
      code: 'wrongType',
      level: 'error',
      message: `Error: ${valueString} is not a valid value for ${name}`,
      identifiers: [`'${name}'`],
    }];
  }
  return [];
}
