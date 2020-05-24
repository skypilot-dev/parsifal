/* eslint-disable no-console */

import {
  ArgumentDefV1,
  NamedArgumentDef,
  PositionalArgumentDef,
  ValidationException,
} from './_types';
import { formatNamedArgUse } from './formatters/formatNamedArgUse';

type ShowUsageOptions = {
  argumentDefs?: ArgumentDefV1[];
  command?: string;
  exceptions?: ValidationException[];
  exitCode?: number;
  exitProcessWhenTesting?: boolean;
  message?: string;
}

export function showUsageV1(options: ShowUsageOptions): never {
  const {
    argumentDefs = [],
    command = 'command',
    exceptions = [],
    exitCode = 0,
    exitProcessWhenTesting, // if true, call `process.exit()` even when running in test mode
    message = exceptions.map(({ message }) => message).join('\n'),
  } = options;
  const writeToDisplay = exitCode ? console.log : console.error;

  const namedArgDefs = argumentDefs
    .filter(({ positional }) => !positional) as NamedArgumentDef[];

  const namedArgString = namedArgDefs
    .map((argDef) => formatNamedArgUse(argDef))
    .join(' ');

  const positionalArgDefs = argumentDefs
    .filter(({ positional }) => !!positional) as PositionalArgumentDef[];

  const positionalArgString = positionalArgDefs.map((argDef, index) => {
    const { name = `ARG${index + 1}`, required } = argDef;
    return required ? name.toUpperCase() : `[${name.toUpperCase()}]`;
  }).join(' ');

  if ((message || exitCode) && !exitProcessWhenTesting) {
    if (process.env.NODE_ENV === 'test') {
      throw new Error(message);
    }
    writeToDisplay(`Error: ${message}`);
  }
  console.log(`Usage: ${command} ${namedArgString} ${positionalArgString}`);
  process.exit(exitCode);
}
