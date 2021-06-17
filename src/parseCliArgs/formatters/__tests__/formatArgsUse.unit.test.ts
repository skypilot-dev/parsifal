import type { Integer } from '@skypilot/common-types';

import type { ArgumentDefinition } from '../../_types';
import { formatArgsUse } from '../formatArgsUse';

function unindent(templateStringsArray: TemplateStringsArray, indentSize: Integer): string {
  return templateStringsArray
    .map(
      block => block.split('\n').map(line => line.slice(indentSize)).join('\n')
    )
    .join('')
    .split('\n')
    .filter((line, index) => index > 0 || !!line)
    .filter((line, index) => index < (line.length - 1) || !!line)
    .join('\n');
}

function unindentBy(indentSize: Integer) {
  return (templateStringsArray: TemplateStringsArray) => unindent(templateStringsArray, indentSize);
}

describe('formatArgsUse', () => {
  it('should list argument names in the left column and types in the right', () => {
    const argDefs: ArgumentDefinition[] = [
      {
        name: 'stringArg',
        valueType: 'string',
      },
      {
        name: 'integerArg',
        valueType: 'integer',
      },
    ];
    const expected = unindentBy(4)`
      --stringArg   string
      --integerArg  integer
    `;

    const actual = formatArgsUse(argDefs);
    expect(actual).toBe(expected);
  });

  it('should display valid values if defined', () => {
    const argDefs: ArgumentDefinition[] = [
      {
        name: 'stringArg',
        valueType: 'string',
        validValues: ['a', 'b'],
      },
      {
        name: 'integerArg',
        valueType: 'integer',
        validValues: [1, 2],
      } as const,
    ];
    const expected = unindentBy(4)`
      --stringArg=a|b   string
      --integerArg=1|2  integer
    `;

    const actual = formatArgsUse(argDefs);
    expect(actual).toBe(expected);
  });

  it('should display a label if defined', () => {
    const argDefs: ArgumentDefinition[] = [
      {
        name: 'stringArg',
        valueType: 'string',
      },
      {
        name: 'integerArg',
        valueType: 'integer',
        valueLabel: 'description of the integer argument',
      } as const,
    ];
    const expected = unindentBy(4)`
      --stringArg   string
      --integerArg  description of the integer argument
    `;

    const actual = formatArgsUse(argDefs);
    expect(actual).toBe(expected);
  });

  it('should display the value range if defined', () => {
    const argDefs: ArgumentDefinition[] = [
      {
        name: 'integerArg',
        validRange: [1, 100],
        valueType: 'integer',
      },
    ];
    const expected = unindentBy(4)`
      --integerArg=1–100  integer
    `;

    const actual = formatArgsUse(argDefs);
    expect(actual).toBe(expected);
  });
});
