import { ArgumentValue, ValueType } from '../../_types';
import { hasCorrectType } from '../hasCorrectType';

describe('', () => {
  it("should return true if valueType is 'string', 'boolean', or 'number' & value is of that type", () => {
    const valueTypes: readonly ValueType[] = ['boolean', 'integer', 'number', 'string'] as const;
    const sampleValues: ArgumentValue[] = [0, 1.1, 'stringValue', true, false];
    const goodValuesMap = new Map<typeof valueTypes[number], ArgumentValue[]>([
      ['boolean', [true, false]],
      ['integer', [0]],
      ['number', [0, 1.1]],
      ['string', ['stringValue']],
    ]);

    valueTypes.forEach((valueType) => {
      sampleValues.forEach((value) => {

        const typeIsCorrect = hasCorrectType(valueType, value);

        const goodValuesForType = goodValuesMap.get(valueType);
        const expected = goodValuesForType?.includes(value);

        expect(typeIsCorrect).toStrictEqual(expected);
      });
    });
  });
});
