import type { Argument, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { validateConstrainedValue } from '~src/parseCliArgs/validators/validateConstrainedValue.ts';
import { validateCustom } from '~src/parseCliArgs/validators/validateCustom.ts';
import { validateRange } from '~src/parseCliArgs/validators/validateRange.ts';

export function validateConstrainedArgs(argsMap: Map<string, Argument>): ValidationException[] {
  const constrainedArgs = [...argsMap.entries()]
    .filter(
      ([_name, argument]) =>
        !!(argument.definition.validate || argument.definition.validRange || argument.definition.validValues),
    );

  const exceptions: ValidationException[] = [];

  for (const [_name, argument] of constrainedArgs) {
    const { definition, value } = argument;
    exceptions.push(
      ...validateConstrainedValue(value, definition),
      ...validateCustom(value, definition),
      ...validateRange(value, definition)
    );
  }

  return exceptions;
}
