import { ArgumentDefinition, ArgumentValue, ValidationException } from './_types';
import { validateConstrainedValue } from './validators/validateConstrainedValue';
import { validateRequiredPositionalArgs } from './validators/validateRequiredPositionalArgs';

function validateConstrainedArgs(
  positionalArgs: ArgumentValue[], argDefs: ArgumentDefinition[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef, i) => {
    const value = positionalArgs[i];
    return [
      ...accExceptions,
      ...validateConstrainedValue(value, {
        ...argDef,
        name: argDef.name || 'name',
      }),
    ];
  }, [] as ValidationException[]);
}

export function validatePositionalArgs(
  positionalArgs: ArgumentValue[], argDefs: ArgumentDefinition[]
): ValidationException[] {
  return [
    ...validateConstrainedArgs(positionalArgs, argDefs),
    ...validateRequiredPositionalArgs(positionalArgs, argDefs),
  ];
}
