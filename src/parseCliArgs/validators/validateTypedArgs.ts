import type { Argument, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { validateTypedValue } from '~src/parseCliArgs/validators/validateTypedValue.ts';

export function validateTypedArgs(argsMap: Map<string, Argument>): ValidationException[] {
  const typedArgDefs = Array.from(argsMap.entries())
    .filter(([_name, argument]) => !!argument.definition.valueType)
    /* Skip undefined values, which are handled by `validateRequiredArgs` */
    .filter(([_name, argument]) => argument.value !== undefined);

  return typedArgDefs.reduce((accExceptions, [_name, argument]) => {
    const { definition, value } = argument;
    return [
      ...accExceptions,
      ...validateTypedValue(value, definition),
    ];
  }, [] as ValidationException[]);
}
