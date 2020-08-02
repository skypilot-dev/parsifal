import path from 'path';
import type { Integer } from '@skypilot/common-types';
import { initialParse } from '../initialParse';
import type {
  Argument,
  ArgumentDefinition,
  ArgumentInput,
  ArgumentValue,
  PositionalArgumentDef,
  ValidationException,
} from './_types';
import { mapArgs } from './mapArgs';
import { showUsage } from './showUsage';
import { validateArgs } from './validateArgs';
import { validateArgDefs } from './validators/validateArgDefs';
import { validateOptionNames } from './validators/validateOptionNames';
import { validatePositionalArgDefs } from './validators/validatePositionalArgDefs';

type NamedArgsResult = {
  [key: string]: ArgumentValue | ArgumentValue[];
}

export interface UnnamedArgsResult {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

export type ParsedArgsResult = NamedArgsResult & UnnamedArgsResult

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
  const positionalArgDefs: PositionalArgumentDef[] = positionalArgDefInputs
    .map((input) => (
      typeof input === 'string'
        ? { name: input, positional: true }
        : { ...input, positional: true }
    ));

  const configExceptions: ValidationException[] = [
    ...validateOptionNames(positionalArgDefs),
    ...validateArgDefs([...namedArgDefs, ...positionalArgDefs]),
    ...validatePositionalArgDefs(positionalArgDefs),
  ];

  if (configExceptions.length) {
    throw new Error(configExceptions.map(({ message }) => message).join('. ')
    );
  }

  const argDefs: ArgumentDefinition[] = [...namedArgDefs, ...positionalArgDefs];
  const stringArgNames: string[] = argDefs
    .filter(({ valueType }) => valueType === 'string')
    .map(({ name }) => name);

  const parsedArgs = initialParse(args, { '--': true, string: stringArgNames });
  const {
    _: positionalArgs = [],
    '--': unparsedArgs = [],
  } = parsedArgs;

  const argsMap = mapArgs(parsedArgs, argDefs, { mapAllNamedArgs });

  if (args.includes('--help') || args.includes('-h')) {
    showUsage({
      argsMap,
      command: scriptName,
      exitCode: 0,
      exitProcessWhenTesting,
    });
  }

  const argumentExceptions: ValidationException[] = validateArgs(argsMap);

  if (argumentExceptions.length) {
    showUsage({
      argsMap,
      command: scriptName,
      exceptions: argumentExceptions,
      exitCode: 1,
      exitProcessWhenTesting,
    });
  }

  return {
    _positional: positionalArgs,
    _unparsed: unparsedArgs,
    ...Object.fromEntries(argsMapToEntries(argsMap)),
  };
}
