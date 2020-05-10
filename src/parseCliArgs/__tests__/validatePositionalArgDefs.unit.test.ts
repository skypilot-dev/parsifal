import { PositionalArgumentDef } from '../_types';
import { validatePositionalArgDefs } from '../validatePositionalArgDefs';

describe('validatePositionalArgDefs()', () => {
  it('should return no exceptions when the definitions are valid', () => {
    const argDefs = ['a', { name: 'option2' }];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected: string[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions when no definitions were given', () => {
    const argDefs: string[] = [];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected: string[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return an exception when a required arg follows a string-defined arg', () => {
    const argDefs: Array<PositionalArgumentDef | string> = [
      'option1', // string definitions always imply `required:false`
      { name: 'option2', required: true },
    ];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected = [{
      level: 'error',
      message: 'Invalid definitions: Required args must precede optional args (the 1st is optional, but the 2nd is required)',
      name: 'option2',
    }]
    expect(exceptions).toEqual(expected);
  });

  it('should return an exception when a required arg follows an optional arg', () => {
    const argDefs: Array<PositionalArgumentDef | string> = [
      { name: 'option1', required: false },
      { name: 'option2', required: true },
    ];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected = [{
      level: 'error',
      message: 'Invalid definitions: Required args must precede optional args (the 1st is optional, but the 2nd is required)',
      name: 'option2',
    }]
    expect(exceptions).toEqual(expected);
  });
});
