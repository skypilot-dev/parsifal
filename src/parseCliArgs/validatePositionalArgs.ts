import { ArgumentValue, PositionalArgumentDef, ValidationException } from './_types';
import { validateConstrainedValue } from './validators/validateConstrainedValue';
import { validateRequiredPositionalArgs } from './validators/validateRequiredPositionalArgs';

function validateConstrainedArgs(
  positionalArgs: ArgumentValue[], argDefs: PositionalArgumentDef[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef, i) => {
    const value = positionalArgs[i];
    return [
      ...accExceptions,
      ...validateConstrainedValue(value, argDef),
    ];
  }, [] as ValidationException[]);
}

export function validatePositionalArgs(
  positionalArgs: ArgumentValue[], argDefs: PositionalArgumentDef[]
): ValidationException[] {
  return [
    ...validateConstrainedArgs(positionalArgs, argDefs),
    ...validateRequiredPositionalArgs(positionalArgs, argDefs),
  ];
}
