import type { ArgumentDefinition, ArgumentValue, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { validateConstrainedValue } from '~src/parseCliArgs/validators/validateConstrainedValue.ts';
import { validateRequiredPositionalArgs } from '~src/parseCliArgs/validators/validateRequiredPositionalArgs.ts';

function validateConstrainedArgs(
  positionalArgs: ArgumentValue[],
  argDefs: ArgumentDefinition[],
): ValidationException[] {
  return argDefs.reduce<ValidationException[]>((accExceptions, argDef, i) => {
    const value = positionalArgs[i];
    return [
      ...accExceptions,
      ...validateConstrainedValue(value, {
        ...argDef,
        name: argDef.name || 'name',
      }),
    ];
  }, []);
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
