import { NamedArgumentDef } from './_types';

export function formatNamedArgUse(argDef: NamedArgumentDef): string {
  const { name, required, valueLabel = 'value', valueType } = argDef;
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
