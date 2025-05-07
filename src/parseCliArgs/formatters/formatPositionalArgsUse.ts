import type { ArgumentDefinition } from '~src/parseCliArgs/_types/index.ts';
import { formatValueLabel } from '~src/parseCliArgs/formatters/formatValueLabel.ts';

/* FIXME: Add tests */

export function formatPositionalArgsUse(argDefs: ArgumentDefinition[]): string {
  return argDefs.map((argDef) => formatValueLabel(argDef)).join(' ');
}
