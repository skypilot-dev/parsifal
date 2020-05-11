import { ArgumentsMap, ArgumentValue, NamedArgumentDef, ValidationException } from './_types';
import { validateConstrainedValue } from './validateConstrainedValue';

function getOrUndefined<T extends ArgumentValue>(key: string, argsMap: ArgumentsMap): T | undefined {
  return Object.prototype.hasOwnProperty.call(argsMap, key)
    ? argsMap[key] as T | undefined
    : undefined;
}

function validateConstrainedArgs(
  argsMap: ArgumentsMap, argDefs: NamedArgumentDef[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    const { name } = argDef;
    const value = getOrUndefined(name, argsMap);
    const exception = validateConstrainedValue(value, argDef);
    return exception ? [...accExceptions, exception] : accExceptions;
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
