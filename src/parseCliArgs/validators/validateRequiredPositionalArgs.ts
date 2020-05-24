import { Integer } from '@skypilot/common-types';
import { toOrdinal } from 'src/lib/functions/string/toOrdinal';
import { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';

function getIndexOfLastRequired(argDefs: ArgumentDefinition[]): Integer {
  let highestIndex = -1;
  for (let i = 0; i < argDefs.length; i += 1) {
    const argDef = argDefs[i];
    if (!argDef?.required) {
      return highestIndex;
    }
    highestIndex = i;
  }
  return highestIndex;
}

function getArgName(argDef: ArgumentDefinition, ordinal: Integer): string {
  return argDef?.name
    ? `'${argDef.name}'`
    : `the ${toOrdinal(ordinal)} argument`;
}

export function validateRequiredPositionalArgs(
  positionalArgs: ArgumentValue[], argDefs: ArgumentDefinition[]
): ValidationException[] {
  const howManyRequired = getIndexOfLastRequired(argDefs) + 1;
  const howManyReceived = positionalArgs.length;
  const howManyMissing = howManyRequired - howManyReceived;
  const firstMissingIndex = howManyRequired - howManyMissing;
  const lastMissingIndex = firstMissingIndex + howManyMissing;

  if (howManyMissing < 1) {
    return [];
  }

  const unsatisfiedArgDefs = argDefs
    .slice(firstMissingIndex, lastMissingIndex) as ArgumentDefinition[];

  return unsatisfiedArgDefs
    .map((positionalArgDef, i) => {
      const ordinal = (firstMissingIndex + i + 1);
      return {
        level: 'error',
        message: `${getArgName(positionalArgDef, ordinal)} is required`,
        identifiers: [positionalArgDef?.name || (firstMissingIndex + i).toString()],
      };
    });
}
