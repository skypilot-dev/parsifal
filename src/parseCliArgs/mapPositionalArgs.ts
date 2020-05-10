import { ArgumentsMap, ArgumentValue, PositionalArgDefInput } from './_types';
import { toOptionName } from './toOptionName';

interface MapPositionalArgsOptions {
  mapAllArgs?: boolean; // if true, map args without definitions to their indices
}

export function mapPositionalArgs(
  values: ArgumentValue[],
  argDefs: PositionalArgDefInput[] = [],
  options: MapPositionalArgsOptions = {},
): ArgumentsMap {
  const { mapAllArgs } = options;

  let argsMap: ArgumentsMap = {};

  for (let i = 0; i < Math.max(argDefs.length, mapAllArgs ? values.length : argDefs.length); i += 1) {
    const argDef = argDefs.length > i ? argDefs[i] : i.toString();
    const key: string = toOptionName(argDef);
    const value = values.length > i ? values[i] : undefined;
    argsMap = { ...argsMap, [key]: value };
  }
  return argsMap;
}
