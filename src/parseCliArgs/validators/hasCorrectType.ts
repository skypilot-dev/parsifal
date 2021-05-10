import { ArgumentValue, ValueType } from '../_types';

function isInteger(value: unknown): boolean {
  return typeof value === 'number' && value % 1 === 0;
}


export function hasCorrectType(valueType: ValueType, value: ArgumentValue | ArgumentValue[]): boolean {
  switch (valueType) {
    case 'integer':
      return isInteger(value);
    case 'integerArray':
      return Array.isArray(value) && value.every(item => isInteger(item));
    case 'stringArray':
      return Array.isArray(value) && value.every(item => typeof item === 'string');
    default:
      return typeof value === valueType;
  }
}
