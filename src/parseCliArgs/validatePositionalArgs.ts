import { Integer } from '@skypilot/common-types';
import { toOrdinal } from '../lib/functions/string/toOrdinal';
import { ArgumentValue, PositionalArgumentDef, ValidationException } from './_types';
import { validateConstrainedValue } from './validateConstrainedValue';

function getIndexOfLastRequired(argDefs: PositionalArgumentDef[]): Integer {
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

function getArgName(argDef: PositionalArgumentDef, ordinal: Integer): string {
  return argDef?.name
    ? `'${argDef.name}'`
    : `the ${toOrdinal(ordinal)} argument`;
}

function validateConstrainedArgs(
  positionalArgs: ArgumentValue[], argDefs: PositionalArgumentDef[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef, i) => {
    const value = positionalArgs[i];
    return [
      ...accExceptions,
      ...validateConstrainedValue(value, argDef),
    ];
  }, [] as ValidationException[]);
}

function validateRequiredArgs(
  positionalArgs: ArgumentValue[], argDefs: PositionalArgumentDef[]
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
    .slice(firstMissingIndex, lastMissingIndex) as PositionalArgumentDef[];

  return  unsatisfiedArgDefs
    .map((positionalArgDef, i) => {
      const ordinal = (firstMissingIndex + i + 1);
      return {
        level: 'error',
        message: `${getArgName(positionalArgDef, ordinal)} is required`,
        identifiers: [positionalArgDef?.name || (firstMissingIndex + i).toString()],
      };
    });
}

export function validatePositionalArgs(
  positionalArgs: ArgumentValue[], argDefs: PositionalArgumentDef[]
): ValidationException[] {
  return [
    ...validateConstrainedArgs(positionalArgs, argDefs),
    ...validateRequiredArgs(positionalArgs, argDefs),
  ];
}
