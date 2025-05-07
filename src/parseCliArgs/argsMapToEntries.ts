import type { Argument, ArgumentValue } from '~src/parseCliArgs/_types/index.ts';

export function argsMapToEntries(argsMap: Map<string, Argument>): Array<[string, ArgumentValue | ArgumentValue[]]> {
  const entries = [...argsMap.entries()];
  return entries.map(([name, argument]) => [name, argument.value]);
}
