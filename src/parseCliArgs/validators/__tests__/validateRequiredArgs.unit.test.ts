import { ValidationException } from '../../_types';
import { validateRequiredArgs } from '../validateRequiredArgs';

describe('validateRequiredArgs()', () => {
  it('should return no exceptions if no args are required', () => {
    const argsMap = new Map([
      ['optional1', { definition: { name: 'optional1' }, value: undefined }],
      ['optional2', { definition: { name: 'optional2' }, value: undefined }],
    ]);

    const exceptions = validateRequiredArgs(argsMap);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return no exceptions if all required args are provided', () => {
    const argsMap = new Map([
      ['required1', { definition: { name: 'optional1', required: true }, value: 1 }],
      ['optional2', { definition: { name: 'optional2' }, value: undefined }],
    ]);

    const exceptions = validateRequiredArgs(argsMap);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return an exception for a missing argument', () => {
    const argsMap = new Map([
      ['required1', { definition: { name: 'required1', required: true }, value: undefined }],
    ]);

    const exceptions = validateRequiredArgs(argsMap);

    const expected = [
      {
        code: 'missing',
        level: 'error',
        message: 'This required argument is missing: required1',
        identifiers: ['required1'],
      },
    ];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return a single exception for missing arguments', () => {
    const argsMap = new Map([
      ['required1', { definition: { name: 'required1', required: true }, value: undefined }],
      ['required2', { definition: { name: 'required2', required: true }, value: 1 }],
      ['required3', { definition: { name: 'required3', required: true }, value: undefined }],
      ['optional4', { definition: { name: 'optional3', positional: true }, value: undefined }],
    ]);

    const exceptions = validateRequiredArgs(argsMap);

    const expected = [
      {
        code: 'missing',
        level: 'error',
        message: 'These required arguments are missing: required1, required3',
        identifiers: ['required1', 'required3'],
      },
    ];
    expect(exceptions).toStrictEqual(expected);
  });
});
