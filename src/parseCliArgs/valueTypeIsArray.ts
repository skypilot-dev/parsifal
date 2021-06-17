import { ValueType } from './_types';

export function valueTypeIsArray(valueType: ValueType | undefined): valueType is 'integerArray' | 'stringArray' {
  if (!valueType) {
    return false;
  }
  return ['integerArray', 'stringArray'].includes(valueType);
}
