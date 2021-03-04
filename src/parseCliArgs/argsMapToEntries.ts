import { Argument, ArgumentValue } from './_types';

export function argsMapToEntries(argsMap: Map<string, Argument>): Array<[string, ArgumentValue]> {
  const entries = Array.from(argsMap.entries());
  return entries.map(([name, argument]) => [name, argument.value]);
}
