import { ArgumentsMap, NamedArgumentDef, ValidationException } from './_types';

export function validateNamedArgs(
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
