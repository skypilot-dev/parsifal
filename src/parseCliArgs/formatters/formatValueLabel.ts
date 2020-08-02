import type { ArgumentDefinition } from '../_types';

export function formatValueLabel(argDef: ArgumentDefinition): string {
  const {
    name,
    positional,
    validValues = [],
    valueType,
    valueLabel,
  } = argDef;

  if (valueLabel) {
    return `<${valueLabel}>`;
  }

  if (validValues.length) {
    return validValues.join('|');
  }

  const inferredValueLabel = valueType || (positional ? name : 'value');
  return `<${inferredValueLabel}>`;
}
