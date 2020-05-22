import { getOrDefault } from 'src/lib/functions/object/getOrDefault';
import { ArgumentsMap, NamedArgumentDef, ValidationException } from './_types';
import { validateConstrainedValue } from './validators/validateConstrainedValue';
import { validateRequiredArgs } from './validators/validateRequiredArgs';

function validateConstrainedArgs(
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

export function validateNamedArgs(
  argsMap: ArgumentsMap, namedArgDefs: NamedArgumentDef[]
): ValidationException[] {
  return [
    ...validateRequiredArgs(argsMap, namedArgDefs),
    ...validateConstrainedArgs(argsMap, namedArgDefs),
  ];
}
