import { getOrDefault } from '../lib/functions/object/getOrDefault';
import type { ArgumentsMap, NamedArgumentDef } from './_types';

export function mapNamedArgs(
  argsMap: ArgumentsMap, namedArgDefs: NamedArgumentDef[]
): ArgumentsMap {
  return namedArgDefs.reduce((accArgsMap, argDef) => {
    const { defaultValue, name } = argDef;
    return {
      ...accArgsMap,
      [name]: getOrDefault(argsMap, name, defaultValue),
    };
  }, {});
}
