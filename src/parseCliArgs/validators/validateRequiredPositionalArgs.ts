import { toOrdinal } from '~src/lib/functions/string/toOrdinal.ts';
import type { ArgumentDefinition, ArgumentValue, ValidationException } from '~src/parseCliArgs/_types/index.ts';

function getIndexOfLastRequired(argDefs: ArgumentDefinition[]): number {
  let highestIndex = -1;
  for (const [i, argDef] of argDefs.entries()) {
    if (!argDef.required) {
      return highestIndex;
    }
    highestIndex = i;
  }
  return highestIndex;
}

function getArgName(argDef: ArgumentDefinition, ordinal: number): string {
  return argDef.name ? `'${argDef.name}'` : `the ${toOrdinal(ordinal)} argument`;
}

export function validateRequiredPositionalArgs(
  positionalArgs: ArgumentValue[],
  argDefs: ArgumentDefinition[],
): ValidationException[] {
  const howManyRequired = getIndexOfLastRequired(argDefs) + 1;
  const howManyReceived = positionalArgs.length;
  const howManyMissing = howManyRequired - howManyReceived;
  const firstMissingIndex = howManyRequired - howManyMissing;
  const lastMissingIndex = firstMissingIndex + howManyMissing;

  if (howManyMissing < 1) {
    return [];
  }

  const unsatisfiedArgDefs = argDefs.slice(firstMissingIndex, lastMissingIndex);

  return unsatisfiedArgDefs.map((positionalArgDef, i) => {
    const ordinal = firstMissingIndex + i + 1;
    return {
      level: 'error',
      message: `${getArgName(positionalArgDef, ordinal)} is required`,
      identifiers: [positionalArgDef.name || (firstMissingIndex + i).toString()],
    };
  });
}
