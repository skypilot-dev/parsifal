import type { ArgumentDefinition } from '../_types';
import { formatValueLabel } from './formatValueLabel';

/* FIXME: Add tests */

export function formatPositionalArgsUse(argDefs: ArgumentDefinition[]): string {
  return argDefs.map(argDef => formatValueLabel(argDef)).join(' ');
}
