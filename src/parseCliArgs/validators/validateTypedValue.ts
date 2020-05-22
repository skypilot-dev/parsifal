import { ArgumentDef, ArgumentValue, ValidationException } from '../_types';

export function validateTypedValue(
  value: ArgumentValue, argDef: ArgumentDef
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
      level: 'error',
      message: `Invalid value for '${argDef.name}': ${valueString} (expected type: ${valueType})`,
      identifiers: [`'${argDef.name}'`],
    }];
  }
  return [];
}
