import { ArgumentDefinition, ValidationException } from '../../_types';
import { disallowWrongTypeDefault } from '../disallowWrongTypeDefault';


describe('disallowWrongTypeDefault()', () => {
  it('should return no exceptions when `defaultValue` or `valueType` is undefined', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'option1' },
      { name: 'option2', defaultValue: 1 },
      { name: 'option3', valueType: 'integer' },
    ];

    const exceptions = disallowWrongTypeDefault(argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return no exceptions when `defaultValue` is of `valueType', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'option1', defaultValue: true, valueType: 'boolean' },
      { name: 'option2', defaultValue: 1, valueType: 'integer' },
      { name: 'option3', defaultValue: 1.2, valueType: 'number' },
      { name: 'option4', defaultValue: 'value', valueType: 'string' },
    ];

    const exceptions = disallowWrongTypeDefault(argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return an exception if `defaultValue` is not of `valueType`', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'booleanOpt', defaultValue: 0, valueType: 'boolean' },
      { name: 'integerOpt', defaultValue: 0.1, valueType: 'integer' },
      { name: 'numberOpt', defaultValue: true, valueType: 'number' },
      { name: 'stringOpt', defaultValue: 0, valueType: 'string' },
    ];
    const exceptions = disallowWrongTypeDefault(argDefs);

    const expected: ValidationException[] = [
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for booleanOpt: The default value is not of boolean type',
        identifiers: ['booleanOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for integerOpt: The default value is not of integer type',
        identifiers: ['integerOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for numberOpt: The default value is not of number type',
        identifiers: ['numberOpt'],
      },
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for stringOpt: The default value is not of string type',
        identifiers: ['stringOpt'],
      },
    ];

    expect(exceptions).toStrictEqual(expected);
  });
});
