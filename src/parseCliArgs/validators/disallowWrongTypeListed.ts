import type { ArgumentDefinition, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { hasCorrectType } from '~src/parseCliArgs/validators/hasCorrectType.ts';
import { parseBaseType } from '~src/parseCliArgs/validators/parseBaseType.ts';

export function disallowWrongTypeListed(argDefs: ArgumentDefinition[]): ValidationException[] {
  const exceptions: ValidationException[] = [];

  for (const argDef of argDefs) {
    const { name, validValues, valueType } = argDef;

    if (validValues === undefined || valueType === undefined) {
      continue;
    }

    const baseType = parseBaseType(valueType);
    if (validValues.every((value) => hasCorrectType(baseType, value))) {
      continue;
    }

    exceptions.push({
      code: 'badDefinition',
      level: 'error',
      message: `Bad definition for ${name}: validValues must be of ${baseType} type`,
      identifiers: [name],
    });
  }

  return exceptions;
}
