/* eslint-disable no-console */
import path from 'path';
import minimist from 'minimist';
import { NamedArgumentDef, PositionalArgumentDef } from './_types/types';
import { omitAliases } from './omitAliases';
import { parseAliases } from './parseAliases';
import { showUsage } from './showUsage';
import { validateArgs } from './validateArgs';

type LiteralValue = boolean | number | string;

export type ArgumentsMap = {
  [key: string]: LiteralValue | LiteralValue[];
}

type ParseCliArgsOptions = {
  args?: string[];
  argumentDefs?: Array<NamedArgumentDef | PositionalArgumentDef>;
  requireNamedArgDefs?: boolean;
  usage?: string;
}

export function parseCliArgs(options: ParseCliArgsOptions = {}): ArgumentsMap {
  /* Discard first two args to get command-line arguments. */
  const scriptName = options.args ? 'command' : path.parse(process.argv[1]).base;

  const {
    args = process.argv.slice(2),
    argumentDefs = [],
    requireNamedArgDefs = false,
  } = options;

  const positionalArgDefs: PositionalArgumentDef[] = argumentDefs
    .filter(({ isPositional, name }) => isPositional || !name);
  const namedArgDefs: NamedArgumentDef[] = argumentDefs
    .filter((argDef) => argDef.name && !argDef.isPositional) as NamedArgumentDef[];
  const aliasMap = parseAliases(namedArgDefs);

  const parsedArgs = minimist(args, { alias: aliasMap });

  const { _: positionalArgs, '--': afterStopArgs, ...namedArgs } = parsedArgs;

  if ((positionalArgs?.length || 0) > (positionalArgDefs.length)) {
    const unexpectedArgs = positionalArgs
      .slice(positionalArgDefs.length, positionalArgs.length)
      .join(' ');
    showUsage({
      argumentDefs,
      exitCode: 1,
      message: `Unexpected arguments: ${unexpectedArgs}`,
    })
  }

  const positionalArgsMap = positionalArgs.reduce((map, value, index) => {
    const argDef = argumentDefs[index];
    const { name = index.toString() } = argDef;
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
      command: scriptName,
      exitCode: 1,
      message: error.message,
      argumentDefs: argumentDefs,
    });
  }
  return { ...positionalArgsMap, ...namedArgsMap };
}
