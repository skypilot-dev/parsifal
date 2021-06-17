import type { Integer } from '@skypilot/common-types';
import type { ArgumentDefinition } from '../_types';

function formatValidValues(validValues: ReadonlyArray<any> | undefined): string {
  if (!validValues) {
    return '';
  }
  return validValues.join('|');
}

function toNameWithValues(
  name: string, validRange: number[] | undefined, validValues: undefined | ReadonlyArray<any>
): string {
  if (!validValues && !validRange) {
    return name;
  }
  const formattedValidValues = validRange ? `${validRange[0]}–${validRange[1]}` : formatValidValues(validValues);
  return [
    name,
    formattedValidValues,
  ].join(' ');
}

const gutterWidth = 2;
const leftIndentWidth = 2;

function formatArgUse(argDefinition: ArgumentDefinition, options: { leftColWidth: Integer }): string {
  const { name, valueLabel, validRange, validValues, valueType } = argDefinition;
  return [
    ' '.repeat(leftIndentWidth),
    '--',
    toNameWithValues(name, validRange, validValues).padEnd(options.leftColWidth),
    ' '.repeat(gutterWidth),
    valueLabel || valueType,
  ].join('');
}

export function formatArgsUse(argDefinitions: ArgumentDefinition[]): string {
  const namesWithValues = argDefinitions.map(({ name , validRange, validValues }) => [
    toNameWithValues(name, validRange, validValues),
  ].join(' '));
  const leftColWidth = namesWithValues.reduce(
    (acc, nameWithValues) => Math.max(acc, nameWithValues.length),
    0
  );
  return argDefinitions.map(
    argDefinition => formatArgUse(argDefinition, { leftColWidth })
  ).join('\n');
}
