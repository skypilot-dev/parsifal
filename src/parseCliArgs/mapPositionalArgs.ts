import { getOrDefault } from '~src/lib/functions/object/getOrDefault.ts';
import type { ArgumentsMap, ArgumentValue, PositionalArgumentDef } from '~src/parseCliArgs/_types/index.ts';

interface MapPositionalArgsOptions {
  mapAllArgs?: boolean; // if true, map args without definitions to their indices
  useIndicesAsOptionNames?: boolean; // if true, use the index when an option has no defined name
}

export function mapPositionalArgs(
  values: ArgumentValue[],
  argDefs: PositionalArgumentDef[] = [],
  options: MapPositionalArgsOptions = {},
): ArgumentsMap {
  const {
    mapAllArgs = false,
    useIndicesAsOptionNames = false,
  } = options;

  let argsMap: ArgumentsMap = {};

  for (let i = 0; i < Math.max(argDefs.length, mapAllArgs ? values.length : argDefs.length); i += 1) {
    const argDef: PositionalArgumentDef = (argDefs.length > i && argDefs[i]) || { name: i.toString() };
    const { name, defaultValue } = argDef;
    if (typeof argDef === 'object' && !argDef.name && !mapAllArgs && !useIndicesAsOptionNames) {
      continue;
    }
    const value = values.length > i ? values[i] : getOrDefault(argsMap, name, defaultValue);
    argsMap = { ...argsMap, [name]: value };
  }
  return argsMap;
}
