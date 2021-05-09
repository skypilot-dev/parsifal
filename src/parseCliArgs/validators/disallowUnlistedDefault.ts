import { ArgumentDefinition, ValidationException } from '../_types';

export function disallowUnlistedDefault(
  argDefs: ArgumentDefinition[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    const { defaultValue, validValues } = argDef;

    if (!validValues || typeof defaultValue === 'undefined') {
      return accExceptions;
    }

    const defaultValues = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    const invalidValues = defaultValues.filter((value: any) => !validValues.includes(value));

    if (invalidValues.length > 0) {
      return [
        ...accExceptions,
        {
          code: 'badDefinition',
          level: 'error',
          message: [
            `Bad definition for ${argDef.name}`,
            invalidValues.length === 1
              ? 'The default value is not one of the valid values'
              : 'Some default values are not among the valid values',
          ].join(': '),
          identifiers: [argDef.name],
        },
      ];
    }
    return accExceptions;
  }, [] as ValidationException[]);
}
