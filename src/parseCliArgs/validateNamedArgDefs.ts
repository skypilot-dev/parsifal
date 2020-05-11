import { NamedArgumentDef, ValidationException } from './_types';

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

export function validateNamedArgDefs(
  positionalArgDefs: NamedArgumentDef[]
): ValidationException[] {
  return [
    ...validateDefaultAndRequired(positionalArgDefs),
  ];
}
