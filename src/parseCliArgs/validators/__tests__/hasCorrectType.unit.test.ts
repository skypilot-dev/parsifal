import { describe, expect, it } from 'vitest';

import type { ArgumentValue, ValueType } from '~src/parseCliArgs/_types/index.ts';
import { hasCorrectType } from '~src/parseCliArgs/validators/hasCorrectType.ts';

describe(hasCorrectType, () => {
  it("returns true if valueType is 'string', 'boolean', or 'number' & value is of that type", () => {
    const valueTypes: readonly ValueType[] = ['boolean', 'integer', 'number', 'string'] as const;
    const sampleValues: ArgumentValue[] = [0, 1.1, 'stringValue', true, false];
    const goodValuesMap = new Map<(typeof valueTypes)[number], ArgumentValue[]>([
      ['boolean', [true, false]],
      ['integer', [0]],
      ['number', [0, 1.1]],
      ['string', ['stringValue']],
    ]);

    for (const valueType of valueTypes) {
      for (const value of sampleValues) {
        const typeIsCorrect = hasCorrectType(valueType, value);

        const goodValuesForType = goodValuesMap.get(valueType);
        const expected = goodValuesForType?.includes(value);

        expect(typeIsCorrect).toStrictEqual(expected);
      }
    }
  });
});
