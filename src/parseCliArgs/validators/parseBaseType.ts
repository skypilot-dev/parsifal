import { ValueType } from '../_types';

export function parseBaseType(valueType: ValueType): ValueType {
  if (['integerArray', 'stringArray'].includes(valueType)) {
    return valueType.replace('Array', '') as ValueType;
  }
  return valueType;
}
