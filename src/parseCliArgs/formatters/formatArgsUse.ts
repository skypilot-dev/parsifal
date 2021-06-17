import type { ArgumentDefinition } from '../_types';

function formatValidValues(validValues: ReadonlyArray<any>): string {
  return validValues.join('|');
}

function toNameWithValues(name: string, validValues: undefined | ReadonlyArray<any>): string {
  if (!validValues) {
    return name;
  }
  return [
    name,
    ...(validValues ? [formatValidValues(validValues)] : []),
  ].join(' ');
}

const gutterWidth = 2;
const leftIndentWidth = 2;

export function formatArgsUse(argDefinitions: ArgumentDefinition[]): string {
  const namesWithValues = argDefinitions.map(({ name , validValues }) => [
    toNameWithValues(name, validValues),
  ].join(' '));
  const leftColWidth = namesWithValues.reduce(
    (acc, nameWithValues) => Math.max(acc, nameWithValues.length),
    0
  );
  return argDefinitions.map(
    ({ name, valueLabel, validValues, valueType }) => [
      ' '.repeat(leftIndentWidth),
      '--',
      toNameWithValues(name, validValues).padEnd(leftColWidth),
      ' '.repeat(gutterWidth),
      valueLabel || valueType,
    ].join('')).join('\n');
}
