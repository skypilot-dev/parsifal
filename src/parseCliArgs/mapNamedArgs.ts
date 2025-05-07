import { getOrDefault } from '~src/lib/functions/object/getOrDefault.ts';
import type { ArgumentsMap, NamedArgumentDef } from '~src/parseCliArgs/_types/index.ts';

export function mapNamedArgs(argsMap: ArgumentsMap, namedArgDefs: NamedArgumentDef[]): ArgumentsMap {
  const result: ArgumentsMap = {};

  for (const argDef of namedArgDefs) {
    const { defaultValue, name } = argDef;
    result[name] = getOrDefault(argsMap, name, defaultValue);
  }

  return result;
}
