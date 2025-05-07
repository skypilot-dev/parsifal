import type { Argument, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { validateConstrainedArgs } from '~src/parseCliArgs/validators/validateConstrainedArgs.ts';
import { validateRequiredArgs } from '~src/parseCliArgs/validators/validateRequiredArgs.ts';
import { validateTypedArgs } from '~src/parseCliArgs/validators/validateTypedArgs.ts';

export function validateArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return [
    ...validateRequiredArgs(argsMap),
    ...validateConstrainedArgs(argsMap),
    ...validateTypedArgs(argsMap),
  ];
}
