import minimist from 'minimist';
import { Integer } from '@skypilot/common-types';
import { ArgumentValue, NamedArgumentDef, PositionalArgumentDef } from './_types';
import { mapPositionalArgs } from './mapPositionalArgs';

export interface ParsedArgsResult {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

interface Definitions {
  named?: Array<NamedArgumentDef | string>;
  positional?: Array<PositionalArgumentDef | string>;
}

interface ParseCliArgsOptions {
  apiVersion?: Integer;
  args?: string[]; // arguments explicitly passed in instead of parsed from the command line
  exitProcessWhenTesting?: boolean;
  isTest?: boolean;
  mapAllArgs?: boolean;
  maxPositionalArgs?: Integer;
  separateAfterStopArgs?: boolean;
}

export function parseCliArgs(
  definitions: Definitions = {}, options: ParseCliArgsOptions = {}
): ParsedArgsResult {

  const {
    args = process.argv.slice(2),
    mapAllArgs,
  } = options;
  const { positional: positionalArgDefs = [] } = definitions;

  const parsedArgs = minimist(args, { '--': true });

  const {
    _: positionalArgs = [],
    '--': unparsedArgs = [],
  } = parsedArgs;

  const positionalArgsMap = mapPositionalArgs(positionalArgs, positionalArgDefs, { mapAllArgs });

  return {
    _positional: positionalArgs,
    _unparsed: unparsedArgs,
    ...positionalArgsMap,
  };
}
