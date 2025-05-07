import { isNonNullable } from '~src/lib/functions/isNonNullable.ts';
import type { Argument, ValidationException } from '~src/parseCliArgs/_types/index.ts';

function combine(exceptions: ValidationException[]): ValidationException[] {
  const missing = exceptions.filter(({ code }) => code === 'missing');
  if (missing.length < 2) {
    return exceptions;
  }
  const notMissing = exceptions.filter(({ code }) => code !== 'missing');
  const combinedIdentifiers = missing.map(({ identifiers }) => identifiers[0]);
  const combinedMissing: ValidationException = {
    code: 'missing',
    level: 'error',
    message: `These required arguments are missing: ${combinedIdentifiers.join(', ')}`,
    identifiers: missing.map(({ identifiers }) => identifiers[0]).filter(isNonNullable),
  };
  return [...notMissing, combinedMissing];
}

export function validateRequiredArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return combine(
    Array.from(argsMap.entries())
      .filter(([_name, argument]) => !!argument.definition.required)
      .filter(([name]) => argsMap.get(name)?.value === undefined)
      .map(([name]) => ({
        code: 'missing',
        level: 'error',
        message: `This required argument is missing: ${name}`,
        identifiers: [name],
      })),
  );
}
