import { ArgumentDefinition } from './_types';
import { formatValueLabel } from './formatValueLabel';

export function formatNamedArgUse(argDef: ArgumentDefinition): string {
  const {
    name,
    required,
    valueType,
  } = argDef;
  const parts = [
    '--',
    name,
  ];

  if (!(valueType === 'boolean')) {
    parts.push(`=${formatValueLabel(argDef)}`);
  }

  if (!required) {
    parts.unshift('[');
    parts.push(']');
  }
  return parts.join('');
}
