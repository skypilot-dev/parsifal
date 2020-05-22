import { ArgumentDef, ArgumentValue, ValidationException } from '../_types';

export function validateTypedValue(
  value: ArgumentValue, argDef: ArgumentDef
): ValidationException[] {
  const { valueType } = argDef;
  if (!valueType) {
    return [];
  }
  if (typeof value !== valueType) {
    return [{
      level: 'error',
      message: `Invalid value for '${argDef.name}': Expected type '${valueType}', got '${value}'`,
      identifiers: [`'${argDef.name}'`],
    }];
  }
  return [];
}
