import { getOrDefault } from '../../lib/functions/object/getOrDefault';
import { ArgumentsMap, NamedArgumentDef, ValidationException } from '../_types';
import { validateConstrainedValue } from './validateConstrainedValue';

export function validateConstrainedArgsV1(
  argsMap: ArgumentsMap, argDefs: NamedArgumentDef[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    const { defaultValue, name } = argDef;
    const value = getOrDefault(argsMap, name, defaultValue);
    return [
      ...accExceptions,
      ...validateConstrainedValue(value, argDef),
    ];
  }, [] as ValidationException[]);
}
