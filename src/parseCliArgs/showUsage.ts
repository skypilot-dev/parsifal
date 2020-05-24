/* eslint-disable no-console */

import { Argument, ValidationException } from './_types';
import { formatNamedArgUse } from './formatNamedArgUse';
import { formatPositionalArgsUse } from './formatPositionalArgsUse';

type ShowUsageOptions = {
  argsMap: Map<string, Argument>;
  command?: string;
  exceptions?: ValidationException[];
  exitCode?: number;
  exitProcessWhenTesting?: boolean;
  message?: string;
}

export function showUsage(options: ShowUsageOptions): never {
  const {
    argsMap,
    command = 'command',
    exceptions = [],
    exitCode = 0,
    exitProcessWhenTesting, // if true, call `process.exit()` even when running in test mode
    message = exceptions.map(({ message }) => message).join('\n'),
  } = options;
  const writeToDisplay = exitCode ? console.log : console.error;

  const namedArgUsage = Array.from(argsMap.entries())
    .filter(([_name, argument]) => !argument.definition.positional)
    .map(([_name, argument]) => formatNamedArgUse(argument.definition))
    .join(' ');

  const positionalArgDefs = Array.from(argsMap.entries())
    .filter(([_name, argument]) => !!argument.definition.positional)
    .map(([_name, argument]) => argument.definition);
  const positionalArgUsage = formatPositionalArgsUse(positionalArgDefs);

  const usage = [`Usage: ${command}`];
  if (namedArgUsage) {
    usage.push(namedArgUsage);
  }
  if (positionalArgUsage) {
    usage.push(positionalArgUsage);
  }

  console.log(usage.join(' '));
  if ((message || exitCode) && !exitProcessWhenTesting) {
    if (process.env.NODE_ENV === 'test') {
      throw new Error(message);
    }
    writeToDisplay(`Error: ${message}`);
  }
  process.exit(exitCode);
}
