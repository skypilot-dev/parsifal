import { NamedArgumentDef, ValidationException } from '../_types';

function validateDefaultAndRequired(
  argDefs: NamedArgumentDef[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    if (argDef.required && argDef.defaultValue !== undefined) {
      return [
        ...accExceptions,
        {
          level: 'error',
          message: 'Invalid definition: An option cannot be required and have default value',
          identifiers: [argDef.name],
        },
      ]
    }
    return accExceptions;
  }, [] as ValidationException[])
}

/* TODO: Check that `defaultValue` and `validValues` are consistent. */
/* TODO: Check that `defaultValue` and `valueType` are consistent. */
/* TODO: Check that `validValues` and `valueType` are consistent. */

export function validateNamedArgDefs(
  namedArgumentDefs: NamedArgumentDef[]
): ValidationException[] {
  return [
    ...validateDefaultAndRequired(namedArgumentDefs),
  ];
}
