import type { ArgumentValue } from '~src/parseCliArgs/_types/index.ts';

interface FormatArgsForEchoOptions {
  echoUndefined?: boolean;
}

export function formatArgsForEcho(
  argValuesMap: Map<string, ArgumentValue | ArgumentValue[]>,
  unresolvedPositionalArgs: Array<boolean | number | string>,
  options: FormatArgsForEchoOptions = {},
): string[] {
  const { echoUndefined } = options;

  const resolvedArgs = [...argValuesMap.entries()]
    .filter(([_name, value]) => echoUndefined || value !== undefined)
    .map(([name, value]) => `  ${name}: ${JSON.stringify(value)}`);

  return [
    ...(resolvedArgs.length > 0 ? ['Resolved arguments:', ...resolvedArgs] : []),
    ...(unresolvedPositionalArgs.length > 0
      ? [`Unresolved arguments: ${unresolvedPositionalArgs.map((arg) => JSON.stringify(arg)).join(', ')}`]
      : []),
  ];
}
