import { ArgumentsMap, NamedArgumentDef, ValidationException } from './_types';
import { validateConstrainedArgs } from './validators/validateConstrainedArgs';
import { validateRequiredArgs } from './validators/validateRequiredArgs';

export function validateNamedArgs(
  argsMap: ArgumentsMap, namedArgDefs: NamedArgumentDef[]
): ValidationException[] {
  return [
    ...validateRequiredArgs(argsMap, namedArgDefs),
    ...validateConstrainedArgs(argsMap, namedArgDefs),
  ];
}
