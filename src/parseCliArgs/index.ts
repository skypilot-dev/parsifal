/* eslint-disable no-console */

import path from 'path';
import type { Integer } from '@skypilot/common-types';

import { fromEntries } from 'src/lib/functions/object/fromEntries';
import { initialParse } from '../initialParse';
import { argsMapToEntries } from './argsMapToEntries';
import type {
  ArgumentDefinition,
  ArgumentInput,
  ArgumentValue,
  EchoOptions,
  PositionalArgumentDef,
  ValidationException,
} from './_types';
import { formatArgsForEcho } from './utils/formatArgsForEcho';
import { mapArgs } from './mapArgs';
import { showUsage } from './showUsage';
import { toEchoParams } from './utils/toEchoParams';
import { validateArgs } from './validateArgs';
import { validateArgDefs } from './validators/validateArgDefs';
import { validateOptionNames } from './validators/validateOptionNames';
import { validatePositionalArgDefs } from './validators/validatePositionalArgDefs';

export type { ValueValidator } from './_types';

type NamedArgsResult = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
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
  echo?: boolean | EchoOptions;
  description?: string;
  exitProcessWhenTesting?: boolean;
  isTest?: boolean;
  mapAllNamedArgs?: boolean;
  maxPositionalArgs?: Integer;
  separateAfterStopArgs?: boolean;
}

export function parseCliArgs(
  definitions: DefinitionsMap = {}, options: ParseCliArgsOptions = {}
): ParsedArgsResult {
  const scriptName = options.args
    ? path.parse(process.argv.slice(-1)[0]).base // Get the name of the test file
    : path.parse(process.argv[1]).base; // Get the name of the script file

  const {
    args = process.argv.slice(2),
    description,
    echo,
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
      description,
      exitCode: 0,
      exitProcessWhenTesting,
    });
  }

  const argumentExceptions: ValidationException[] = validateArgs(argsMap);

  if (argumentExceptions.length) {
    showUsage({
      argsMap,
      command: scriptName,
      description,
      exceptions: argumentExceptions,
      exitCode: 1,
      exitProcessWhenTesting,
    });
  }

  const argValuesMap = new Map(
    Array.from(argsMap.entries()).map(([name, { value }]) => [name, value])
  );
  const { echoUndefined, shouldEcho } = toEchoParams(argValuesMap, echo);
  if (shouldEcho) {
    const unnamedPositionalArgs = positionalArgs.slice(positionalArgDefInputs.length);
    console.log([
      ...(description ? [description].flat() : []),
      ...formatArgsForEcho(
        argValuesMap,
        unnamedPositionalArgs,
        { echoUndefined }
      ),
    ].join('\n'));
  }

  return {
    _positional: positionalArgs,
    _unparsed: unparsedArgs,
    ...fromEntries(argsMapToEntries(argsMap)),
  };
}
