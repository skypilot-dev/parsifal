import type { ValueType } from '~src/parseCliArgs/_types/index.ts';

export function valueTypeIsArray(valueType: ValueType | undefined): valueType is 'integerArray' | 'stringArray' {
  if (!valueType) {
    return false;
  }
  return ['integerArray', 'stringArray'].includes(valueType);
}
