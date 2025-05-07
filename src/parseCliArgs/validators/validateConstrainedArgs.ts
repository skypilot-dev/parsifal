import type { Argument, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { validateConstrainedValue } from '~src/parseCliArgs/validators/validateConstrainedValue.ts';
import { validateCustom } from '~src/parseCliArgs/validators/validateCustom.ts';
import { validateRange } from '~src/parseCliArgs/validators/validateRange.ts';

export function validateConstrainedArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return [...argsMap.entries()]
    .filter(
      ([_name, argument]) =>
        !!(argument.definition.validate || argument.definition.validRange || argument.definition.validValues),
    )
    .reduce<ValidationException[]>((accExceptions, [_name, argument]) => {
      const { definition, value } = argument;
      return [
        ...accExceptions,
        ...validateConstrainedValue(value, definition),
        ...validateCustom(value, definition),
        ...validateRange(value, definition),
      ];
    }, []);
}
