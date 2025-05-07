import { getOrDefault } from '~src/lib/functions/object/getOrDefault.ts';
import type { ArgumentsMap, NamedArgumentDef } from '~src/parseCliArgs/_types/index.ts';

export function mapNamedArgs(argsMap: ArgumentsMap, namedArgDefs: NamedArgumentDef[]): ArgumentsMap {
  return namedArgDefs.reduce((accArgsMap, argDef) => {
    const { defaultValue, name } = argDef;
    return {
      ...accArgsMap,
      [name]: getOrDefault(argsMap, name, defaultValue),
    };
  }, {});
}
