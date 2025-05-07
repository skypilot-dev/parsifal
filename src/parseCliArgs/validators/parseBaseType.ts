import type { ValueType } from '~src/parseCliArgs/_types/index.ts';

export function parseBaseType(valueType: ValueType): ValueType {
  switch (valueType) {
    case 'integerArray':
      return 'integer';
    case 'stringArray':
      return 'string';
    default:
      return valueType;
  }
}
