import { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';

export function validateTypedValue(
  value: ArgumentValue, argDef: ArgumentDefinition
): ValidationException[] {
  const { valueType } = argDef;
  if (!valueType) {
    return [];
  }
  const hasCorrectType = valueType === 'integer'
    ? typeof value === 'number' && value % 1 === 0
    : typeof value === valueType;

  if (!hasCorrectType) {
    const valueString = typeof value === 'string' ? `'${value}'` : `${value}`;
    return [{
      code: 'wrongType',
      level: 'error',
      message: `Error: ${valueString} is not a valid value for ${argDef.name}`,
      identifiers: [`'${argDef.name}'`],
    }];
  }
  return [];
}
