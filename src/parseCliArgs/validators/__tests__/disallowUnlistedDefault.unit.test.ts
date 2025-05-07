import { describe, expect, it } from 'vitest';

import { ArgumentDefinition, ValidationException } from '../../_types';
import { disallowUnlistedDefault } from '../disallowUnlistedDefault';


describe(disallowUnlistedDefault, () => {
  it('returns no exceptions when `defaultValue` or `validValues` is undefined', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'option1' },
      { name: 'option2', defaultValue: 1 },
      { name: 'option3', validValues: [1, 2] },
    ];

    const exceptions = disallowUnlistedDefault(argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('returns an exception when an arg def specifies `validValues` and a default value that is not among them', () => {
    const argDefs: ArgumentDefinition[] = [{
      defaultValue: 1,
      name: 'option',
      validValues: ['a', 2],
    }];

    const exceptions = disallowUnlistedDefault(argDefs);

    const expected = [
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Bad definition for option: The default value is not one of the valid values',
        identifiers: ['option'],
      },
    ];
    expect(exceptions).toStrictEqual(expected);
  });
});
