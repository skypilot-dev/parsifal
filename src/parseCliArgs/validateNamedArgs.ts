import { ArgumentsMap, NamedArgumentDef, ValidationException } from './_types';
import { validateConstrainedArgsV1 } from './validators/validateConstrainedArgsV1';
import { validateRequiredArgsV1 } from './validators/validateRequiredArgsV1';

export function validateNamedArgs(
  argsMap: ArgumentsMap, namedArgDefs: NamedArgumentDef[]
): ValidationException[] {
  return [
    ...validateRequiredArgsV1(argsMap, namedArgDefs),
    ...validateConstrainedArgsV1(argsMap, namedArgDefs),
  ];
}
