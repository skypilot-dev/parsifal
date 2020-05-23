import { Argument, ValidationException } from '../_types';

export function validateRequiredArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return Array.from(argsMap.entries())
    .filter(([_name, argument]) => !!argument.definition.required)
    .filter(([name]) => argsMap.get(name)?.value === undefined)
    .map(([name]) => ({
      level: 'error',
      message: `'${name}' is required`,
      identifiers: [name],
    }));
}
