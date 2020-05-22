import { getOrDefault } from 'src/lib/functions/object/getOrDefault';
import { ArgumentsMap, NamedArgumentDef, ValidationException } from './_types';
import { validateConstrainedValue } from './validateConstrainedValue';

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

function validateRequiredArgs(
  namedArgs: ArgumentsMap, namedArgDefs: NamedArgumentDef[]
): ValidationException[] {
  const unsatisfiedArgDefs = namedArgDefs
    .filter(({ required }) => !!required)
    .filter(({ name }) => (
      !Object.prototype.hasOwnProperty.call(namedArgs, name) || namedArgs[name] === undefined
    ));

  return unsatisfiedArgDefs
    .map((namedArgDef ) => ({
      level: 'error',
      message: `'${namedArgDef.name}' is required`,
      identifiers: [namedArgDef.name],
    }));
}

export function validateNamedArgs(
  argsMap: ArgumentsMap, namedArgDefs: NamedArgumentDef[]
): ValidationException[] {
  return [
    ...validateRequiredArgs(argsMap, namedArgDefs),
    ...validateConstrainedArgs(argsMap, namedArgDefs),
  ];
}
