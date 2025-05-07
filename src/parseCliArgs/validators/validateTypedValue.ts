import type { ArgumentDefinition, ArgumentValue, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { hasCorrectType } from '~src/parseCliArgs/validators/hasCorrectType.ts';

export function validateTypedValue(
  value: ArgumentValue | ArgumentValue[], argDef: ArgumentDefinition
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
      message: `${valueString} is not a valid value for ${name}`,
      identifiers: [name],
    }];
  }
  return [];
}
