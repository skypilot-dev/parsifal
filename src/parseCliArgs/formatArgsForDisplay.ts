import type { Argument } from './_types';
import { argsMapToEntries } from './argsMapToEntries';

interface FormatArgsForDisplayOptions {
  echoUndefined?: boolean;
}

export function formatArgsForDisplay(
  argsMap: Map<string, Argument>,
  unresolvedPositionalArgs: Array<boolean | number | string>,
  options: FormatArgsForDisplayOptions = {}
): string[] {
  const { echoUndefined } = options;
  const entries = argsMapToEntries(argsMap);

  return [
    ...(entries.length ? ['Resolved arguments:'] : []),
    ...entries
      .filter(([_name, value]) => echoUndefined || value !== undefined)
      .map(([name, value]) => `  ${name}: ${JSON.stringify(value)}`),
    ...(unresolvedPositionalArgs.length
      ? [`Unresolved arguments: ${unresolvedPositionalArgs.map(arg => JSON.stringify(arg)).join(', ')}`]
      : []),
  ];
}
