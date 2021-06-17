import type { Integer } from '@skypilot/common-types';
import type { ArgumentDefinition } from '../_types';

function formatValidValues(validValues: ReadonlyArray<any> | undefined): string {
  if (!validValues) {
    return '';
  }
  return validValues.join('|');
}

function getValueLabel(argDefinition: ArgumentDefinition): string {
  const { validRange, valueLabel, valueType } = argDefinition;
  if (valueLabel) {
    return valueLabel;
  }
  if (!validRange) {
    return '';
  }
  return valueType || '';
}

function getNameWithValues(
  argDefinition: ArgumentDefinition,
): string {
  const { name, validRange, validValues, valueType } = argDefinition;
  if (!validValues && !validRange) {
    return `${name}=<${valueType}>`;
  }
  const formattedValidValues = validRange ? `${validRange[0]}–${validRange[1]}` : formatValidValues(validValues);
  return [
    name,
    formattedValidValues,
  ].join('=');
}

const gutterWidth = 2;
const leftIndentWidth = 2;

function formatArgUse(argDefinition: ArgumentDefinition, options: { leftColWidth: Integer }): string {
  const valueLabel = getValueLabel(argDefinition);
  return [
    ' '.repeat(leftIndentWidth),
    '--',
    getNameWithValues(argDefinition).padEnd(options.leftColWidth),
    ...(valueLabel ? [' '.repeat(gutterWidth), valueLabel] : []),
  ].join('').trimEnd();
}

export function formatArgsUse(argDefinitions: ArgumentDefinition[]): string {
  const namesWithValues = argDefinitions.map(argDefinition => [
    getNameWithValues(argDefinition),
  ].join(' '));
  const leftColWidth = namesWithValues.reduce(
    (acc, nameWithValues) => Math.max(acc, nameWithValues.length),
    0
  );
  return argDefinitions.map(
    argDefinition => formatArgUse(argDefinition, { leftColWidth })
  ).join('\n');
}
