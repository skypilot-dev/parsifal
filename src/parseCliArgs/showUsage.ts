/* eslint-disable-next-line no-console */

import { ArgumentDef, NamedArgumentDef, PositionalArgumentDef } from './_types/types';
import { formatNamedArgUse } from './formatNamedArgUse';

type ShowUsageOptions = {
  argumentDefs: ArgumentDef[];
  command?: string;
  exitCode?: number;
  message?: string;
}

export function showUsage(options: ShowUsageOptions): never {
  const {
    argumentDefs = [],
    exitCode = 0,
    command = 'command',
    message,
  } = options;
  const writeToDisplay = exitCode ? console.log : console.error;

  const namedArgDefs = argumentDefs
    .filter(({ isPositional }) => !isPositional) as NamedArgumentDef[];

  const namedArgString = namedArgDefs
    .map((argDef) => formatNamedArgUse(argDef))
    .join(' ');

  const positionalArgDefs = argumentDefs
    .filter(({ isPositional }) => !!isPositional) as PositionalArgumentDef[];

  const positionalArgString = positionalArgDefs.map((argDef, index) => {
    const { name = `ARG${index + 1}`, required } = argDef;
    return required ? name.toUpperCase() : `[${name.toUpperCase()}]`;
  }).join(' ');

  if (message || exitCode) {
    writeToDisplay(`Error: ${message}`);
  }
  console.log(`Usage: ${command} ${namedArgString} ${positionalArgString}`);
  process.exit(exitCode);
}
