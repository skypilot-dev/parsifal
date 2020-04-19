/* eslint-disable no-console */
import { Integer } from '@skypilot/common-types';
import path from 'path';
import minimist from 'minimist';
import { NamedArgumentDef, PositionalArgumentDef } from './_types/types';
import { omitAliases } from './omitAliases';
import { parseAliases } from './parseAliases';
import { showUsage } from './showUsage';
import { validateArgs } from './validateArgs';

type LiteralValue = boolean | number | string;

export type ArgumentsMap = {
  [key: string]: LiteralValue | LiteralValue[] | undefined;
  '--'?: string[];
}

type ParseCliArgsOptions = {
  args?: string[];
  argumentDefs?: Array<NamedArgumentDef | PositionalArgumentDef>;
  isTest?: boolean;
  maxPositionalArgs?: Integer;
  exitProcessWhenTesting?: boolean;
  requireNamedArgDefs?: boolean;
  separateAfterStopArgs?: boolean;
  usage?: string;
}

export function parseCliArgs(options: ParseCliArgsOptions = {}): ArgumentsMap {
  /* Discard first two args to get command-line arguments. */
  const scriptName = options.args ? 'command' : path.parse(process.argv[1]).base;

  const {
    args = process.argv.slice(2),
    argumentDefs = [],
    maxPositionalArgs = -1,
    exitProcessWhenTesting,
    requireNamedArgDefs = false,
    separateAfterStopArgs = false,
  } = options;

  const positionalArgDefs: PositionalArgumentDef[] = argumentDefs
    .filter(({ isPositional, name }) => isPositional || !name);
  const namedArgDefs: NamedArgumentDef[] = argumentDefs
    .filter((argDef) => argDef.name && !argDef.isPositional) as NamedArgumentDef[];
  const aliasMap = parseAliases(namedArgDefs);

  const parsedArgs = minimist(args, { alias: aliasMap, '--': separateAfterStopArgs });

  const { _: positionalArgs, '--': afterStopArgs = [], ...namedArgs } = parsedArgs;

  if (maxPositionalArgs >= 0) {
    if (positionalArgs.length > maxPositionalArgs) {
      const unexpectedArgs = positionalArgs
        .slice(maxPositionalArgs, positionalArgs.length)
        .join(' ');
      showUsage({
        argumentDefs,
        exitCode: 1,
        exitProcessWhenTesting: exitProcessWhenTesting,
        message: `Unexpected arguments: ${unexpectedArgs}`,
      })
    }
  }

  console.log('positionalArgs:', positionalArgs);

  const positionalArgsMap = positionalArgs.reduce((map, value, index) => {
    const name = (
      positionalArgDefs.length > index && positionalArgDefs[index].name
    ) || index.toString();
    return {
      ...map,
      [name]: value,
    }
  }, {});
  const namedArgsMap = omitAliases(namedArgs, aliasMap);

  try {
    validateArgs(namedArgDefs, namedArgsMap, requireNamedArgDefs);
    validateArgs(positionalArgDefs, positionalArgsMap);
  } catch (error) {
    showUsage({
      argumentDefs: argumentDefs,
      command: scriptName,
      exitCode: 1,
      message: error.message,
      exitProcessWhenTesting: exitProcessWhenTesting,
    });
  }
  return {
    ...positionalArgsMap,
    ...namedArgsMap,
    ...(afterStopArgs.length > 0 ? { '--': afterStopArgs } : {}),
  };
}
