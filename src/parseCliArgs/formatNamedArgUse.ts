import { ArgumentDefinition } from './_types';

export function formatNamedArgUse(argDef: ArgumentDefinition): string {
  const {
    name,
    required,
    valueType,
    valueLabel = valueType || 'value',
  } = argDef;
  const parts = [
    '--',
    name,
  ];
  if (!(valueType === 'boolean')) {
    parts.push(`=<${valueLabel}>`);
  }
  if (!required) {
    parts.unshift('[');
    parts.push(']');
  }
  return parts.join('');
}
