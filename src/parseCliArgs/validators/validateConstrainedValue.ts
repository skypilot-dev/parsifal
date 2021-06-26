import type { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';

function isValidConstrainedValue<T>(validValues: ReadonlyArray<T>, value: T | undefined): boolean {
  return value !== undefined && validValues.includes(value);
}

function formatValue(value: unknown): string {
  return typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
}

export function validateConstrainedValue(
  value: ArgumentValue | ArgumentValue[], argDef: ArgumentDefinition,
): ValidationException[] {
  if (value === undefined) {
    /* An undefined value, if not permitted, will be flagged as a missing required value,
       so it isn't reported as an exception here. */
    return [];
  }
  const { validValues, valueType } = argDef;
  if (!validValues) {
    return [];
  }

  const isValid = Array.isArray(value)
    ? value.every(item => isValidConstrainedValue(validValues, item))
    : isValidConstrainedValue(validValues, value);

  const isArrayType = ['integerArray', 'stringArray'].includes(valueType || '');

  if (!isValid) {
    return [{
      code: 'unlistedValue',
      level: 'error',
      message: `Invalid value ${formatValue(value)} for '${argDef.name}'. Allowed values: ${[
        ...(isArrayType ? ['('] : []),
        ...validValues
          .map((validValue) => formatValue(validValue)).join('|'),
        ...(isArrayType ? [')[]'] : []),
      ].join('')}`,
      identifiers: [argDef.name],
    }];
  }
  return [];
}
