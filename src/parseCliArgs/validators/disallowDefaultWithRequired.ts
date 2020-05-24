import { NamedArgumentDef, ValidationException } from '../_types';

export function disallowDefaultWithRequired(
  argDefs: NamedArgumentDef[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    if (argDef.required && argDef.defaultValue !== undefined) {
      return [
        ...accExceptions,
        {
          level: 'error',
          message: 'Invalid definition: An option cannot be required and have a default value',
          identifiers: [argDef.name],
        },
      ]
    }
    return accExceptions;
  }, [] as ValidationException[])
}
