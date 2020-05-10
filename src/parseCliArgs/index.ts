import { Integer } from '@skypilot/common-types';
import { initialParse } from '../initialParse';
import {
  ArgumentValue,
  NamedArgumentDef,
  PositionalArgDefInput,
  ValidationException,
} from './_types';
import { mapPositionalArgs } from './mapPositionalArgs';
import { validateOptionNames } from './validateOptionNames';
import { validatePositionalArgDefs } from './validatePositionalArgDefs';

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

  const {
    args = process.argv.slice(2),
    mapAllArgs,
    useIndicesAsOptionNames,
  } = options;
  const { positional: positionalArgDefs = [] } = definitions;

  const parsedArgs = initialParse(args, { '--': true });

  const {
    _: positionalArgs = [],
    '--': unparsedArgs = [],
  } = parsedArgs;

  const exceptions: ValidationException[] = [
    ...validateOptionNames(positionalArgDefs, { useIndicesAsOptionNames }),
    ...validatePositionalArgDefs(positionalArgDefs),
  ];

  if (exceptions.length) {
    throw new Error(exceptions.map(({ message }) => message).join('. ')
    );
  }

  const positionalArgsMap = mapPositionalArgs(positionalArgs, positionalArgDefs, { mapAllArgs });

  return {
    _positional: positionalArgs,
    _unparsed: unparsedArgs,
    ...positionalArgsMap,
  };
}
