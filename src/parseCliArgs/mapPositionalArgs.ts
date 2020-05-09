import { ArgumentsMap, ArgumentValue, PositionalArgumentDef } from './_types';

export function mapPositionalArgs(
  values: ArgumentValue[],
  argDefs: Array<PositionalArgumentDef | string> = [],
): ArgumentsMap {
  let argsMap: ArgumentsMap = {};

  for (let i = 0; i < Math.max(argDefs.length, values.length); i += 1) {
    const argDef = argDefs.length > i ? argDefs[i] : i.toString();
    const key: string = typeof argDef === 'string' ? argDef : (argDef.name || i.toString()) ;
    const value = values.length > i ? values[i] : undefined;
    argsMap = { ...argsMap, [key]: value };
  }
  return argsMap;
}
