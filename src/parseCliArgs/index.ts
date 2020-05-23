import path from 'path';
import { Integer } from '@skypilot/common-types';
import { initialParse } from '../initialParse';
import {
  Argument,
  ArgumentDefinition,
  ArgumentInput,
  ArgumentValue,
  ValidationException,
} from './_types';
import { mapArgs } from './mapArgs';
import { showUsage } from './showUsage';
import { validateArgs } from './validateArgs';
import { validateNamedArgDefs } from './validateNamedArgDefs';
import { validateOptionNames } from './validateOptionNames';
import { validatePositionalArgDefs } from './validatePositionalArgDefs';

export interface ParsedArgsResult {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

export interface DefinitionsMap {
  named?: ArgumentInput[];
  positional?: ArgumentInput[];
}

interface ParseCliArgsOptions {
  apiVersion?: Integer;
  args?: string[]; // arguments explicitly passed in instead of parsed from the command line
  exitProcessWhenTesting?: boolean;
  isTest?: boolean;
  mapAllNamedArgs?: boolean;
  maxPositionalArgs?: Integer;
  separateAfterStopArgs?: boolean;
}

function argsMapToEntries(argsMap: Map<string, Argument>): Array<[string, ArgumentValue]> {
  const entries = Array.from(argsMap.entries());
  return entries.map(([name, argument]) => [name, argument.value]);
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
    mapAllNamedArgs = false,
  } = options;
  const { named: namedArgDefInputs = [], positional: positionalArgDefInputs = [] } = definitions;

  /* Convert string-defined options to `NamedArgumentDef` objects. */
  const namedArgDefs: ArgumentDefinition[] = namedArgDefInputs
    .map(input => (
      typeof input === 'string' ? { name: input } : input
    ));
  /* Convert string-defined options to `PositionalArgumentDef` objects. */
  const positionalArgDefs: ArgumentDefinition[] = positionalArgDefInputs
    .map((input) => (
      typeof input === 'string'
        ? { name: input, positional: true }
        : { ...input, positional: true }
    ));

  const configExceptions: ValidationException[] = [
    ...validateOptionNames(positionalArgDefs),
    ...validateNamedArgDefs(namedArgDefs),
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

  const argDefs: ArgumentDefinition[] = [...namedArgDefs, ...positionalArgDefs];
  const argsMap = mapArgs(parsedArgs, argDefs, { mapAllNamedArgs });

  const argumentExceptions: ValidationException[] = validateArgs(argsMap);

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
    ...Object.fromEntries(argsMapToEntries(argsMap)),
  };
}
