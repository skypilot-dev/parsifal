import { ArgumentsMap, NamedArgDefInput } from './_types';
import { toOptionName } from './toOptionName';

export function mapNamedArgs(
  argsMap: ArgumentsMap, namedArgDefs: NamedArgDefInput[]
): ArgumentsMap {
  const optionNames = namedArgDefs
    .map(argDef => toOptionName(argDef));
  return optionNames.reduce((accArgs, optionName) => ({
    ...accArgs,
    [optionName]: Object.prototype.hasOwnProperty.call(argsMap, optionName) ? argsMap[optionName] : undefined,
  }), {});
}
