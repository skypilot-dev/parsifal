import path from 'path';
import { Integer } from '@skypilot/common-types';
import { initialParse } from '../initialParse';
import {
  ArgumentValue,
  NamedArgumentDef,
  PositionalArgDefInput,
  ValidationException,
} from './_types';
import { mapPositionalArgs } from './mapPositionalArgs';
import { showUsage } from './showUsage';
import { validateOptionNames } from './validateOptionNames';
import { validatePositionalArgDefs } from './validatePositionalArgDefs';
import { validatePositionalArgs } from './validatePositionalArgs';

export interface ParsedArgsResult {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

export interface DefinitionsMap {
  named?: Array<NamedArgumentDef | string>;
  positional?: PositionalArgDefInput[];
}

interface ParseCliArgsOptions {
  apiVersion?: Integer;
  args?: string[]; // arguments explicitly passed in instead of parsed from the command line
  exitProcessWhenTesting?: boolean;
  isTest?: boolean;
  mapAllArgs?: boolean;
  maxPositionalArgs?: Integer;
  separateAfterStopArgs?: boolean;
  useIndicesAsOptionNames?: boolean;
}

export function parseCliArgs(
  definitions: DefinitionsMap = {}, options: ParseCliArgsOptions = {}
): ParsedArgsResult {
  const scriptName = options.args
    ? path.parse(process.argv.slice(-1)[0]).base // Get the name of the test file
    : path.parse(process.argv[1]).base; // Get the name of the script file

  const {
    args = process.argv.slice(2),
    exitProcessWhenTesting = false,
    mapAllArgs = false,
    useIndicesAsOptionNames = false,
  } = options;
  const { positional: positionalArgDefs = [] } = definitions;

  const parsedArgs = initialParse(args, { '--': true });

  const {
    _: positionalArgs = [],
    '--': unparsedArgs = [],
  } = parsedArgs;

  const configExceptions: ValidationException[] = [
    ...validateOptionNames(positionalArgDefs, { useIndicesAsOptionNames }),
    ...validatePositionalArgDefs(positionalArgDefs),
  ];

  if (configExceptions.length) {
    throw new Error(configExceptions.map(({ message }) => message).join('. ')
    );
  }

  const positionalArgsMap = mapPositionalArgs(positionalArgs, positionalArgDefs, { mapAllArgs });

  const argumentExceptions: ValidationException[] = [
    ...validatePositionalArgs(positionalArgs, positionalArgDefs),
  ];

  if (argumentExceptions.length) {
    showUsage({
      command: scriptName,
      exitCode: 1,
      exitProcessWhenTesting,
      exceptions: argumentExceptions,
    });
  }

  return {
    _positional: positionalArgs,
    _unparsed: unparsedArgs,
    ...positionalArgsMap,
  };
}
