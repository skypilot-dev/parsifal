import type { ArgumentDefinition, ArgumentValue, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { validateConstrainedValue } from '~src/parseCliArgs/validators/validateConstrainedValue.ts';
import { validateRequiredPositionalArgs } from '~src/parseCliArgs/validators/validateRequiredPositionalArgs.ts';

function validateConstrainedArgs(
  positionalArgs: ArgumentValue[],
  argDefs: ArgumentDefinition[],
): ValidationException[] {
  const exceptions: ValidationException[] = [];

  for (const [i, argDef] of argDefs.entries()) {
    const value = positionalArgs[i];

    exceptions.push(
      ...validateConstrainedValue(value, {
        ...argDef,
        name: argDef.name || 'name',
      })
    );
  }

  return exceptions;
}

export function validatePositionalArgs(
  positionalArgs: ArgumentValue[],
  argDefs: ArgumentDefinition[],
): ValidationException[] {
  return [
    ...validateConstrainedArgs(positionalArgs, argDefs),
    ...validateRequiredPositionalArgs(positionalArgs, argDefs),
  ];
}
