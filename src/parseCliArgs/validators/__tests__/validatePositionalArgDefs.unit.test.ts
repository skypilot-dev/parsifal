import { PositionalArgumentDef } from '../../_types';
import { validatePositionalArgDefs } from '../validatePositionalArgDefs';

describe('validatePositionalArgDefs()', () => {
  it('should return no exceptions when the definitions are valid', () => {
    const argDefs: PositionalArgumentDef[] = [{ name: 'a' }, { name: 'option2' }];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected: string[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions when no definitions were given', () => {
    const argDefs: PositionalArgumentDef[] = [];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected: string[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return an exception when a required arg follows an optional arg', () => {
    const argDefs: PositionalArgumentDef[] = [
      { name: 'option1', required: false },
      { name: 'option2', required: true },
    ];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected = [{
      level: 'error',
      message: 'Invalid definitions: Required args must precede optional args (the 1st is optional, but the 2nd is required)',
      identifiers: ['option2'],
    }];
    expect(exceptions).toEqual(expected);
  });
});
