import { describe, expect, it } from 'vitest';

import type { ArgumentDefinition, ArgumentValue, ValidationException, ValueType } from '~src/parseCliArgs/_types/index.ts';
import { validateTypedValue } from '~src/parseCliArgs/validators/validateTypedValue.ts';

describe(validateTypedValue, () => {
  it('if no `valueType` is set, returns an empty array', () => {
    const argDef: ArgumentDefinition = { name: 'option' };
    const values = [0, 1, 'a', true, false];

    values.forEach(value => {
      const exceptions = validateTypedValue(value, argDef);

      const expected: ValidationException[] = [];
      expect(exceptions).toStrictEqual(expected);
    });
  });

  it('if the value is of the `valueType`, returns an empty array', () => {
    const valuesAndTypes: { goodValues: ArgumentValue[]; valueType: ValueType }[] = [
      { goodValues: [false, true], valueType: 'boolean' },
      { goodValues: [0, 1], valueType: 'integer' },
      { goodValues: [0, 0.1], valueType: 'number' },
      { goodValues: ['a'], valueType: 'string' },
    ];

    valuesAndTypes.forEach(({ goodValues, valueType }) => {
      goodValues.forEach(value => {
        const argDef: ArgumentDefinition = { name: 'option', valueType };

        const exceptions = validateTypedValue(value, argDef);

        const expected: ValidationException[] = [];
        expect(exceptions).toStrictEqual(expected);
      });
    });
  });

  it('if the value is not of the `valueType`, returns an array containing an exception', () => {
    const valuesAndTypes: { badValues: ArgumentValue[]; valueType: ValueType }[] = [
      { badValues: [0, 1, '', 'a'], valueType: 'boolean' },
      { badValues: [0.1, '0'], valueType: 'integer' },
      { badValues: ['a', true], valueType: 'number' },
      { badValues: [0, true], valueType: 'string' },
    ];

    valuesAndTypes.forEach(({ badValues, valueType }) => {
      badValues.forEach(value => {
        const argDef: ArgumentDefinition = { name: 'option', valueType };

        const exceptions = validateTypedValue(value, argDef);

        expect(exceptions).toHaveLength(1);
      });
    });
  });
});
