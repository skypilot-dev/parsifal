import type { ArgumentDefinition, ValidationException } from '~src/parseCliArgs/_types/index.ts';

export function disallowUnlistedDefault(argDefs: ArgumentDefinition[]): ValidationException[] {
  const exceptions: ValidationException[] = [];

  for (const argDef of argDefs) {
    const { defaultValue, validValues } = argDef;

    if (!validValues || defaultValue === undefined) {
      continue;
    }

    const defaultValues = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    const invalidValues = defaultValues.filter((value: unknown) => !validValues.includes(value));

    if (invalidValues.length > 0) {
      exceptions.push({
        code: 'badDefinition',
        level: 'error',
        message: [
          `Bad definition for ${argDef.name}`,
          invalidValues.length === 1
            ? 'The default value is not one of the valid values'
            : 'Some default values are not among the valid values',
        ].join(': '),
        identifiers: [argDef.name],
      });
    }
  }

  return exceptions;
}
