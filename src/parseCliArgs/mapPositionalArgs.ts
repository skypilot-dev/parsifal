import { ArgumentMap, ArgumentValue, PositionalArgumentDef } from './_types';

export function mapPositionalArgs(
  positionalArgDefs: Array<PositionalArgumentDef | string>,
  values: ArgumentValue[],
): ArgumentMap {
  let argsMap: ArgumentMap = {};
  for (let i = 0; i < Math.max(positionalArgDefs.length, values.length); i += 1) {
    const argDef = positionalArgDefs.length > i ? positionalArgDefs[i] : i.toString();
    if (typeof argDef !== 'string') {
      throw new Error('Object definitions are not yet supported');
    }
    const value = values.length > i ? values[i] : undefined;
    argsMap = { ...argsMap, [argDef]: value };
  }
  return argsMap;
}
