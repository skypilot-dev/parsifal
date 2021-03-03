import { ArgumentDefinition, ValidationException } from '../_types';

export function disallowDefaultWithRequired(
  argDefs: ArgumentDefinition[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    if (argDef.required && argDef.defaultValue !== undefined) {
      return [
        ...accExceptions,
        {
          code: 'badDefinition',
          level: 'error',
          message: 'Invalid definition: An option cannot be required and have a default value',
          identifiers: [argDef.name],
        },
      ];
    }
    return accExceptions;
  }, [] as ValidationException[]);
}
