import type { ArgumentValue } from '../_types';

interface FormatArgsForEchoOptions {
  echoUndefined?: boolean;
}

export function formatArgsForEcho(
  argValuesMap: Map<string, ArgumentValue | ArgumentValue[]>,
  unresolvedPositionalArgs: Array<boolean | number | string>,
  options: FormatArgsForEchoOptions = {}
): string[] {
  const { echoUndefined } = options;

  const resolvedArgs = Array.from(argValuesMap.entries())
    .filter(([_name, value]) => echoUndefined || value !== undefined)
    .map(([name, value]) => `  ${name}: ${JSON.stringify(value)}`);

  return [
    ...(resolvedArgs.length
      ? ['Resolved arguments:', ...resolvedArgs]
      : []),
    ...(unresolvedPositionalArgs.length
      ? [`Unresolved arguments: ${unresolvedPositionalArgs.map(arg => JSON.stringify(arg)).join(', ')}`]
      : []),
  ];
}
