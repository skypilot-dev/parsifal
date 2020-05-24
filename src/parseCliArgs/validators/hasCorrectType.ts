import { ArgumentValue, ValueType } from '../_types';

export function hasCorrectType(valueType: ValueType, value: ArgumentValue): boolean {
  return valueType === 'integer'
    ? typeof value === 'number' && value % 1 === 0
    : typeof value === valueType;
}
