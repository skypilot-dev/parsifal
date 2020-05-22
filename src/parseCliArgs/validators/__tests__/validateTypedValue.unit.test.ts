import { ArgumentDef, ArgumentValue, ValidationException, ValueType } from '../../_types';
import { validateTypedValue } from '../validateTypedValue';

describe('validateTypedValue', () => {
  it('if no `valueType` is set, should return an empty array', () => {
    const argDef: ArgumentDef = {}
    const values = [0, 1, 'a', true, false];

    values.forEach(value => {
      const exceptions = validateTypedValue(value, argDef);

      const expected: ValidationException[] = [];
      expect(exceptions).toStrictEqual(expected);
    })
  });

  it('if the value is of the `valueType`, should return an empty array', () => {
    const valuesAndTypes: { goodValues: ArgumentValue[]; valueType: ValueType }[] = [
      { goodValues: [false, true], valueType: 'boolean' },
      { goodValues: [0, 1], valueType: 'integer' },
      { goodValues: [0, 0.1], valueType: 'number' },
      { goodValues: ['a'], valueType: 'string' },
    ];

    valuesAndTypes.forEach(({ goodValues, valueType }) => {
      goodValues.forEach(value => {
        const argDef: ArgumentDef = { valueType };

        const exceptions = validateTypedValue(value, argDef);

        const expected: ValidationException[] = [];
        expect(exceptions).toStrictEqual(expected);
      });
    });
  });

  it('if the value is not of the `valueType`, should return an array containing an exception', () => {
    const valuesAndTypes: { badValues: ArgumentValue[]; valueType: ValueType }[] = [
      { badValues: [0, 1, '', 'a'], valueType: 'boolean' },
      { badValues: [0.1, '0'], valueType: 'integer' },
      { badValues: ['a', true], valueType: 'number' },
      { badValues: [0, true], valueType: 'string' },
    ];

    valuesAndTypes.forEach(({ badValues, valueType }) => {
      badValues.forEach(value => {
        const argDef: ArgumentDef = { valueType };

        const exceptions = validateTypedValue(value, argDef);

        expect(exceptions).toHaveLength(1);
      });
    });
  });
});
