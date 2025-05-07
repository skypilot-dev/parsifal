import type { Argument, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { validateTypedValue } from '~src/parseCliArgs/validators/validateTypedValue.ts';

export function validateTypedArgs(argsMap: Map<string, Argument>): ValidationException[] {
  const typedArgDefs = [...argsMap.entries()]
    .filter(([_name, argument]) => !!argument.definition.valueType)
    /* Skip undefined values, which are handled by `validateRequiredArgs` */
    .filter(([_name, argument]) => argument.value !== undefined);

  const exceptions: ValidationException[] = [];

  for (const [_name, argument] of typedArgDefs) {
    const { definition, value } = argument;
    exceptions.push(...validateTypedValue(value, definition));
  }

  return exceptions;
}
