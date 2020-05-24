/* eslint-disable no-console */
import path from 'path';
import minimist from 'minimist';
import { Integer } from '@skypilot/common-types';
import { NamedArgumentDef, PositionalArgumentDef } from './_types';
import { omitAliases } from './omitAliases';
import { parseAliases } from './parseAliases';
import { showUsageV1 } from './showUsageV1';
import { validateArgsV1 } from './validateArgsV1';

type LiteralValue = boolean | number | string;

export type ArgumentsMap = {
  [key: string]: LiteralValue | LiteralValue[] | undefined;
  '--'?: string[];
}

export type ParseCliArgsOptionsV1 = {
  apiVersion?: Integer;
  args?: string[];
  argumentDefs?: Array<NamedArgumentDef | PositionalArgumentDef>;
  isTest?: boolean;
  maxPositionalArgs?: Integer;
  exitProcessWhenTesting?: boolean;
  requireNamedArgDefs?: boolean;
  separateAfterStopArgs?: boolean;
  usage?: string;
}

export function parseCliArgsV1(options: ParseCliArgsOptionsV1 = {}): ArgumentsMap {
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
    .filter(({ positional, name }) => positional || !name)
    .map((argDef) => ({ ...argDef, positional: true }));
  const namedArgDefs: NamedArgumentDef[] = argumentDefs
    .filter((argDef) => argDef.name && !argDef.positional) as NamedArgumentDef[];
  const aliasMap = parseAliases(namedArgDefs);

  const parsedArgs = minimist(args, { alias: aliasMap, '--': separateAfterStopArgs });

  const { _: positionalArgs, '--': afterStopArgs = [], ...namedArgs } = parsedArgs;

  if (maxPositionalArgs >= 0) {
    if (positionalArgs.length > maxPositionalArgs) {
      const unexpectedArgs = positionalArgs
        .slice(maxPositionalArgs, positionalArgs.length)
        .join(' ');
      showUsageV1({
        argumentDefs,
        exitCode: 1,
        exitProcessWhenTesting,
        message: `Unexpected arguments: ${unexpectedArgs}`,
      })
    }
  }

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
    validateArgsV1(namedArgDefs, namedArgsMap, requireNamedArgDefs);
    validateArgsV1(positionalArgDefs, positionalArgsMap);
  } catch (error) {
    showUsageV1({
      argumentDefs,
      command: scriptName,
      exitCode: 1,
      message: error.message,
      exitProcessWhenTesting,
    });
  }

  const unnamedArgs = positionalArgs.slice(positionalArgDefs.length);

  return {
    ...positionalArgsMap,
    ...namedArgsMap,
    ...(afterStopArgs.length > 0 ? { '--': afterStopArgs } : {}),
    ...(unnamedArgs.length > 0 ? { _: unnamedArgs } : {}),
  };
}
