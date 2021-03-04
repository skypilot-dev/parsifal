import type { Argument } from './_types';
import { argsMapToEntries } from './argsMapToEntries';

export function formatArgsForDisplay(
  argsMap: Map<string, Argument>,
  unresolvedPositionalArgs: Array<boolean | number | string>
): string[] {
  const entries = argsMapToEntries(argsMap);
  return [
    ...(entries.length ? ['Resolved arguments:'] : []),
    ...entries.map(([name, value]) => `  ${name}: ${JSON.stringify(value)}`),
    ...(unresolvedPositionalArgs.length
      ? [`Unresolved arguments: ${unresolvedPositionalArgs.map(arg => JSON.stringify(arg)).join(', ')}`]
      : []),
  ];
}
