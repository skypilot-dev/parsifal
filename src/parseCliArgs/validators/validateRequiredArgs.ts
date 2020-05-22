import { ArgumentsMap, NamedArgumentDef, ValidationException } from '../_types';

export function validateRequiredArgs(
  argsMap: ArgumentsMap, argDefs: NamedArgumentDef[]
): ValidationException[] {
  const unsatisfiedArgDefs = argDefs
    .filter(({ required }) => !!required)
    .filter(({ name }) => (
      !Object.prototype.hasOwnProperty.call(argsMap, name) || argsMap[name] === undefined
    ));

  return unsatisfiedArgDefs
    .map((argDef ) => ({
      level: 'error',
      message: `'${argDef.name}' is required`,
      identifiers: [argDef.name],
    }));
}
