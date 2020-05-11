import path from 'path';
import { Integer } from '@skypilot/common-types';
import { initialParse } from '../initialParse';
import {
  ArgumentValue, NamedArgDefInput,
  NamedArgumentDef,
  PositionalArgDefInput, PositionalArgumentDef,
  ValidationException,
} from './_types';
import { mapPositionalArgs } from './mapPositionalArgs';
import { mapNamedArgs } from './mapNamedArgs';
import { showUsage } from './showUsage';
import { validateNamedArgs } from './validateNamedArgs';
import { validateOptionNames } from './validateOptionNames';
import { validatePositionalArgDefs } from './validatePositionalArgDefs';
import { validatePositionalArgs } from './validatePositionalArgs';

export interface ParsedArgsResult {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

export interface DefinitionsMap {
  named?: NamedArgDefInput[];
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
  const { named: namedArgDefInputs = [], positional: positionalArgDefInputs = [] } = definitions;

  /* Convert string-defined options to `NamedArgumentDef` objects. */
  const namedArgDefs: NamedArgumentDef[] = namedArgDefInputs
    .map(input => (
      typeof input === 'string' ? { name: input } : input
    ));
  /* Convert string-defined options to `PositionalArgumentDef` objects. */
  const positionalArgDefs: PositionalArgumentDef[] = positionalArgDefInputs
    .map((input, i) => (
      typeof input === 'string'
        ? { name: input }
        : { ...(useIndicesAsOptionNames ? { name: i.toString() } : {}), ...input }
    ));

  const configExceptions: ValidationException[] = [
    ...validateOptionNames(positionalArgDefs, { useIndicesAsOptionNames }),
    ...validatePositionalArgDefs(positionalArgDefs),
  ];

  if (configExceptions.length) {
    throw new Error(configExceptions.map(({ message }) => message).join('. ')
    );
  }

  const parsedArgs = initialParse(args, { '--': true });
  const {
    _: positionalArgs = [],
    '--': unparsedArgs = [],
  } = parsedArgs;

  const namedArgsMap = mapNamedArgs(parsedArgs, namedArgDefs);
  const positionalArgsMap = mapPositionalArgs(positionalArgs, positionalArgDefs, { mapAllArgs });

  const argumentExceptions: ValidationException[] = [
    ...validateNamedArgs(namedArgsMap, namedArgDefs),
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
    ...namedArgsMap,
    ...positionalArgsMap,
  };
}
