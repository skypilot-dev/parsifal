import type { ArgumentDefinition } from '~src/parseCliArgs/_types/index.ts';
import { formatValueLabel } from '~src/parseCliArgs/formatters/formatValueLabel.ts';

export function formatNamedArgUse(argDef: ArgumentDefinition): string {
  const { name, required, valueType } = argDef;
  const parts = ['--', name];

  if (!(valueType === 'boolean')) {
    parts.push(`=${formatValueLabel(argDef)}`);
  }

  if (!required) {
    parts.unshift('[');
    parts.push(']');
  }
  return parts.join('');
}
