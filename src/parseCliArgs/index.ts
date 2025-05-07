import path from 'node:path';

import type { Integer } from '@skypilot/common-types';

import { initialParse } from '~src/initialParse/index.ts';
import { assert } from '~src/lib/functions/assert.ts';
import type {
  ArgumentDefinition,
  ArgumentInput,
  ArgumentValue,
  EchoOptions,
  PositionalArgumentDef,
  ValidationException,
} from '~src/parseCliArgs/_types/index.ts';
import { argsMapToEntries } from '~src/parseCliArgs/argsMapToEntries.ts';
import { mapArgs } from '~src/parseCliArgs/mapArgs.ts';
import { showUsage } from '~src/parseCliArgs/showUsage.ts';
import { formatArgsForEcho } from '~src/parseCliArgs/utils/formatArgsForEcho.ts';
import { toEchoParams } from '~src/parseCliArgs/utils/toEchoParams.ts';
import { validateArgs } from '~src/parseCliArgs/validateArgs.ts';
import { validateArgDefs } from '~src/parseCliArgs/validators/validateArgDefs.ts';
import { validateOptionNames } from '~src/parseCliArgs/validators/validateOptionNames.ts';
import { validatePositionalArgDefs } from '~src/parseCliArgs/validators/validatePositionalArgDefs.ts';

export type { ValueValidator } from '~src/parseCliArgs/_types/index.ts';

interface NamedArgsResult {
  [key: string]: unknown;
}

export interface UnnamedArgsResult {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

export type ParsedArgsResult = NamedArgsResult & UnnamedArgsResult;

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

export function parseCliArgs(definitions: DefinitionsMap = {}, options: ParseCliArgsOptions = {}): ParsedArgsResult {
  const [testFilePath] = process.argv.slice(-1);
  const [_, scriptFilePath] = process.argv;

  const filePath = options.args ? testFilePath : scriptFilePath;
  assert(filePath, 'File path could not be determined.');

  const scriptName = path.parse(filePath).base;

  const {
    args = process.argv.slice(2),
    description,
    echo,
    exitProcessWhenTesting = false,
    mapAllNamedArgs = false,
  } = options;
  const { named: namedArgDefInputs = [], positional: positionalArgDefInputs = [] } = definitions;

  /* Convert string-defined options to `NamedArgumentDef` objects. */
  const namedArgDefs: ArgumentDefinition[] = namedArgDefInputs.map((input) =>
    typeof input === 'string' ? { name: input } : input,
  );
  /* Convert string-defined options to `PositionalArgumentDef` objects. */
  const positionalArgDefs: PositionalArgumentDef[] = positionalArgDefInputs.map((input) =>
    typeof input === 'string' ? { name: input, positional: true } : { ...input, positional: true },
  );

  const configExceptions: ValidationException[] = [
    ...validateOptionNames(positionalArgDefs),
    ...validateArgDefs([...namedArgDefs, ...positionalArgDefs]),
    ...validatePositionalArgDefs(positionalArgDefs),
  ];

  if (configExceptions.length > 0) {
    throw new Error(configExceptions.map(({ message }) => message).join('. '));
  }

  const argDefs: ArgumentDefinition[] = [...namedArgDefs, ...positionalArgDefs];
  const stringArgNames: string[] = argDefs.filter(({ valueType }) => valueType === 'string').map(({ name }) => name);

  const parsedArgs = initialParse(args, { '--': true, string: stringArgNames });
  const { _: positionalArgs = [], '--': unparsedArgs = [] } = parsedArgs;

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

  if (argumentExceptions.length > 0) {
    showUsage({
      argsMap,
      command: scriptName,
      description,
      exceptions: argumentExceptions,
      exitCode: 1,
      exitProcessWhenTesting,
    });
  }

  const argValuesMap = new Map([...argsMap.entries()].map(([name, { value }]) => [name, value]));
  const { echoUndefined, shouldEcho } = toEchoParams(argValuesMap, echo);
  if (shouldEcho) {
    const unnamedPositionalArgs = positionalArgs.slice(positionalArgDefInputs.length);
    console.log(
      [
        ...(description ? [description].flat() : []),
        ...formatArgsForEcho(argValuesMap, unnamedPositionalArgs, { echoUndefined }),
      ].join('\n'),
    );
  }

  return {
    _positional: positionalArgs,
    _unparsed: unparsedArgs,
    ...Object.fromEntries(argsMapToEntries(argsMap)),
  };
}
