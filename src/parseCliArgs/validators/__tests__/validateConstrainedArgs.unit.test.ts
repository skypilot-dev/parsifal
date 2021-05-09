import type { Argument, ValidationException } from 'src/parseCliArgs/_types';
import { validateConstrainedArgs } from '../validateConstrainedArgs';

describe('validateConstrainedArgs()', () => {
  it('should return no exceptions if no args are constrained', () => {
    const argsMap = new Map([
      ['uncon1', { definition: { name: 'uncon1' }, value: undefined }],
      ['uncon2', { definition: { name: 'uncon2' }, value: undefined }],
    ]);

    const exceptions = validateConstrainedArgs(argsMap);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if all constrained args are satisfied', () => {
    const argsMap = new Map<string, Argument>([
      ['uncon1', { definition: { name: 'uncon1' }, value: undefined }],
      ['con2', { definition: { name: 'con2', validValues: [1] }, value: 1 }],
      ['simpleValidate', {
        definition: {
          name: 'simpleValidate',
          validate: value => typeof value === 'number' && value < 2,
        },
        value: 1,
      }],
    ]);

    const exceptions = validateConstrainedArgs(argsMap);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return exceptions for each invalid argument', () => {
    const detailedValidate = (value: number): { ok: boolean; errors?: string[] } => value < 2
      ? { ok: false, errors: [`${value} < 2`] }
      : { ok: true };
    const argsMap = new Map([
      ['con1', { definition: { name: 'con1', validValues: [1] }, value: 2 }],
      ['con2', { definition: { name: 'con2', validValues: [1] }, value: 1 }],
      ['con3', { definition: { name: 'con3', validValues: ['1'] }, value: 1 }],
      ['uncon4', { definition: { name: 'uncon4' }, value: undefined }],
      ['detailedValidate', { definition: { name: 'detailedValidate', validate: detailedValidate }, value: 1 }],
      ['rangeValidate', { definition: { name: 'rangeValidate', validRange: [2, 3] }, value: 1 }],
    ]);

    const exceptions = validateConstrainedArgs(argsMap);

    const expected = [
      {
        code: 'unlistedValue',
        level: 'error',
        message: "Invalid value for 'con1': Expected one of '1', got '2'",
        identifiers: ['con1'],
      },
      {
        code: 'unlistedValue',
        level: 'error',
        message: "Invalid value for 'con3': Expected one of '1', got '1'",
        identifiers: ['con3'],
      },
      {
        code: 'badValue',
        level: 'error',
        message: "Invalid value for 'detailedValidate': 1 < 2",
        identifiers: ['detailedValidate'],
      },
      {
        code: 'outOfRangeValue',
        level: 'error',
        message: "Invalid value for 'rangeValidate': Valid range is 2-3",
        identifiers: ['rangeValidate'],
      },
    ];
    expect(exceptions).toStrictEqual(expected);
  });
});
