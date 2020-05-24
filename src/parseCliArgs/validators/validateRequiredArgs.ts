import { Argument, ValidationException } from '../_types';

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
    identifiers: missing.map(({ identifiers }) => identifiers[0]),
  };
  return [
    ...notMissing,
    combinedMissing,
  ];
}

export function validateRequiredArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return combine(Array.from(argsMap.entries())
    .filter(([_name, argument]) => !!argument.definition.required)
    .filter(([name]) => argsMap.get(name)?.value === undefined)
    .map(([name]) => ({
      code: 'missing',
      level: 'error',
      message: `This required argument is missing: ${name}`,
      identifiers: [name],
    })));
}
