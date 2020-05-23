import { ValidationException } from '../../_types';
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
    const argsMap = new Map([
      ['uncon1', { definition: { name: 'uncon1' }, value: undefined }],
      ['con2', { definition: { name: 'con2', validValues: [1] }, value: 1 }],
    ]);

    const exceptions = validateConstrainedArgs(argsMap);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return exceptions for each invalid argument', () => {
    const argsMap = new Map([
      ['con1', { definition: { name: 'con1', validValues: [1] }, value: 2 }],
      ['con2', { definition: { name: 'con2', validValues: [1] }, value: 1 }],
      ['con3', { definition: { name: 'con3', validValues: ['1'] }, value: 1 }],
      ['uncon4', { definition: { name: 'uncon4' }, value: undefined }],
    ]);

    const exceptions = validateConstrainedArgs(argsMap);

    const expected = [
      {
        level: 'error',
        message: "Invalid value for 'con1': Expected one of '1', got '2'",
        identifiers: ['con1'],
      },
      {
        level: 'error',
        message: "Invalid value for 'con3': Expected one of '1', got '1'",
        identifiers: ['con3'],
      },
    ];
    expect(exceptions).toEqual(expected);
  });
});
