import type { Integer } from '@skypilot/common-types';
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
  it('should', () => {
    const argDefs = [
      {
        name: 'sourceName',
        valueType: 'string',
        required: true,
        validValues: ['a', 'b'],
      } as const,
    ];
    const expected = unindentBy(4)`
      --sourceName a|b
    `;

    const actual = formatArgsUse(argDefs);
    expect(actual).toBe(expected);
  });
});
