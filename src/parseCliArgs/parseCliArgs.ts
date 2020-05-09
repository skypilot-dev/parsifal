import minimist from 'minimist';
import { Integer } from '@skypilot/common-types';
import { NamedArgumentDef, PositionalArgumentDef } from './_types';

type ArgumentValue = LiteralValue | LiteralValue[] | undefined

type LiteralValue = boolean | number | string;

export interface ArgumentsMap {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

interface Definitions {
  named?: NamedArgumentDef[];
  positional?: PositionalArgumentDef[];
}

interface ParseCliArgsOptions {
  apiVersion?: Integer;
  args?: string[]; // arguments explicitly passed in instead of parsed from the command line
  exitProcessWhenTesting?: boolean;
  isTest?: boolean;
  maxPositionalArgs?: Integer;
  separateAfterStopArgs?: boolean;
}

export function parseCliArgs(
  _: Definitions[] = [], options: ParseCliArgsOptions = {}
): ArgumentsMap {

  const {
    args = process.argv.slice(2),
  } = options;

  const parsedArgs = minimist(args, { '--': true });

  const {
    _: positionalArgs = [],
    '--': unparsedArgs = [],
  } = parsedArgs;

  return {
    _positional: positionalArgs,
    _unparsed: unparsedArgs,
  };
}
