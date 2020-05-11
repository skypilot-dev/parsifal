import { getOrDefault } from '../lib/functions/object/getOrDefault';
import { ArgumentsMap, ArgumentValue, PositionalArgumentDef } from './_types';

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
    const argDef = argDefs.length > i ? argDefs[i] : {};
    const { name = i.toString(), defaultValue } = argDef;
    if (typeof argDef === 'object' && !argDef.name && !mapAllArgs && !useIndicesAsOptionNames) {
      continue;
    }
    const value = values.length > i ? values[i] : getOrDefault(argsMap, name, defaultValue);
    argsMap = { ...argsMap, [name]: value };
  }
  return argsMap;
}
