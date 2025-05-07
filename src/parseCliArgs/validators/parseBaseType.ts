import type { ValueType } from '~src/parseCliArgs/_types/index.ts';

export function parseBaseType(valueType: ValueType): ValueType {
  if (['integerArray', 'stringArray'].includes(valueType)) {
    return valueType.replace('Array', '') as ValueType;
  }
  return valueType;
}
