import type { ArgumentDefinition, ValidationException } from '~src/parseCliArgs/_types/index.ts';

export function disallowDefaultWithRequired(argDefs: ArgumentDefinition[]): ValidationException[] {
  const exceptions: ValidationException[] = [];

  for (const argDef of argDefs) {
    if (argDef.required && argDef.defaultValue !== undefined) {
      exceptions.push({
        code: 'badDefinition',
        level: 'error',
        message: 'Invalid definition: An option cannot be required and have a default value',
        identifiers: [argDef.name],
      });
    }
  }

  return exceptions;
}
