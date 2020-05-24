import { ArgumentDefinition, ValidationException } from '../_types';

export function disallowUnlistedDefault(
  argDefs: ArgumentDefinition[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    if (
      argDef.validValues
        && argDef.defaultValue !== undefined
        && !argDef.validValues.includes(argDef.defaultValue)
    ) {
      return [
        ...accExceptions,
        {
          code: 'badDefinition',
          level: 'error',
          message: `Bad definition for ${argDef.name}: The default value is not one of the valid values`,
          identifiers: [argDef.name],
        },
      ]
    }
    return accExceptions;
  }, [] as ValidationException[])
}
