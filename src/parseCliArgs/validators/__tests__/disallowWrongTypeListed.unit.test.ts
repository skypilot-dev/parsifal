import type { ArgumentDefinition, ValidationException } from '../../_types';
import { disallowWrongTypeListed } from '../disallowWrongTypeListed';


describe('disallowWrongTypeListed()', () => {
  it('should return no exceptions when `validValues` or `valueType` is undefined', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'option1' },
      { name: 'option2', validValues: [1] },
      { name: 'option3', valueType: 'integer' },
    ];

    const exceptions = disallowWrongTypeListed(argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return no exceptions when all `validValues` are of `valueType', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'option1', validValues: [true], valueType: 'boolean' },
      { name: 'option2', validValues: [1], valueType: 'integer' },
      { name: 'option3', validValues: [1.2], valueType: 'number' },
      { name: 'option4', validValues: ['value'], valueType: 'string' },
      { name: 'option5', validValues: [1, 2], valueType: 'integerArray' },
      { name: 'option6', validValues: ['a', 'b'], valueType: 'stringArray' },
    ];

    const exceptions = disallowWrongTypeListed(argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return an exception if not all `validValues` are of `valueType`', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'booleanOpt', validValues: [false, 'value'], valueType: 'boolean' },
      { name: 'integerOpt', validValues: [0, 1.1], valueType: 'integer' },
      { name: 'numberOpt', validValues: [1.1, true], valueType: 'number' },
      { name: 'stringOpt', validValues: ['value', 0], valueType: 'string' },
      { name: 'integerArrayOpt', validValues: ['value', 0], valueType: 'integerArray' },
      { name: 'stringArrayOpt', validValues: ['value', 0], valueType: 'stringArray' },
    ];
    const exceptions = disallowWrongTypeListed(argDefs);

    const expected: ValidationException[] = [
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for booleanOpt: validValues must be of boolean type',
        identifiers: ['booleanOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for integerOpt: validValues must be of integer type',
        identifiers: ['integerOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for numberOpt: validValues must be of number type',
        identifiers: ['numberOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for stringOpt: validValues must be of string type',
        identifiers: ['stringOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for integerArrayOpt: validValues must be of integer type',
        identifiers: ['integerArrayOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for stringArrayOpt: validValues must be of string type',
        identifiers: ['stringArrayOpt'],
      },
    ];

    expect(exceptions).toStrictEqual(expected);
  });
});
