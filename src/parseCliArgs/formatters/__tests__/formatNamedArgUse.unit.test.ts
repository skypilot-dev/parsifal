import { describe, expect, it } from 'vitest';

import type { NamedArgumentDef } from '~src/parseCliArgs/_types/index.ts';
import { formatNamedArgUse } from '~src/parseCliArgs/formatters/formatNamedArgUse.ts';

describe(formatNamedArgUse, () => {
  it('by default should show that the argument is optional and takes a value', () => {
    const argDef = {
      name: 'option',
    };

    const argUse = formatNamedArgUse(argDef);

    const expected = '[--option=<value>]';
    expect(argUse).toBe(expected);
  });

  it('when the argument is required, should not show the argument in brackets', () => {
    const argDef = {
      name: 'option',
      required: true,
    };

    const argUse = formatNamedArgUse(argDef);

    const expected = '--option=<value>';
    expect(argUse).toBe(expected);
  });

  it('should display a value label if any', () => {
    const argDef = {
      name: 'color',
      required: true,
      valueLabel: 'hexadecimal value',
    };

    const argUse = formatNamedArgUse(argDef);

    const expected = '--color=<hexadecimal value>';
    expect(argUse).toBe(expected);
  });

  it('should omit VALUE when the valueType is boolean', () => {
    const argDef: NamedArgumentDef = {
      name: 'option',
      valueType: 'boolean',
    };

    const argUse = formatNamedArgUse(argDef);

    const expected = '[--option]';
    expect(argUse).toBe(expected);
  });
});
