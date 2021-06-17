import type { Integer } from '@skypilot/common-types';
import type { ArgumentDefinition } from '../_types';

import { valueTypeIsArray } from '../valueTypeIsArray';

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
  const separator = argDefinition.positional ? ': ' : '=';
  if (!validValues && !validRange) {
    if (valueType === 'boolean') {
      return name;
    }
    if (valueTypeIsArray(valueType)) {
      return [name, `<${valueType.replace('Array', '')}[]>`].join(separator);
    }
    return [name, `<${valueType || 'any'}>`].join(separator);
  }
  const formattedValidValues = ((): string => {
    const isArrayType = valueTypeIsArray(valueType);
    const formattedValues = validRange ? `${validRange[0]}–${validRange[1]}` : formatValidValues(validValues);
    return isArrayType ? `(${formattedValues})[]` : formattedValues;
  })();
  return [
    name,
    formattedValidValues,
  ].join(separator);
}

const gutterWidth = 2;
const leftIndentWidth = 2;

function formatArgUse(argDefinition: ArgumentDefinition, options: { leftColWidth: Integer }): string {
  const valueLabel = getValueLabel(argDefinition);
  return [
    ' '.repeat(leftIndentWidth),
    argDefinition.positional ? '' : '--',
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
