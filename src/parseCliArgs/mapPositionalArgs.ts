import { ArgumentMap, ArgumentValue, PositionalArgumentDef } from './_types';

export function mapPositionalArgs(
  positionalArgDefs: Array<PositionalArgumentDef | string>,
  positionalArgs: ArgumentValue[],
): ArgumentMap {
  return positionalArgDefs.reduce((argsMap, argDef, index) => {
    let value: ArgumentValue = undefined;
    if (typeof argDef === 'string') {
      value = index < positionalArgs.length
        ? positionalArgs[index]
        : undefined;
    } else {
      throw new Error('Object definitions are not yet supported');
    }
    return {
      ...argsMap,
      [argDef]: value,
    };
  }, {} as ArgumentMap);
}
