import { Integer } from '@skypilot/common-types';
import { initialParse } from '../initialParse';
import {
  ArgumentValue,
  NamedArgumentDef,
  PositionalArgDefInput,
  ValidationException,
} from './_types';
import { mapPositionalArgs } from './mapPositionalArgs';
import { validatePositionalArgDefs } from './validatePositionalArgDefs';

export interface ParsedArgsResult {
  _positional?: ArgumentValue[];
  _unparsed?: string[];
}

interface Definitions {
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
}

export function parseCliArgs(
  definitions: Definitions = {}, options: ParseCliArgsOptions = {}
): ParsedArgsResult {

  const {
    args = process.argv.slice(2),
    mapAllArgs,
  } = options;
  const { positional: positionalArgDefs = [] } = definitions;

  const parsedArgs = initialParse(args, { '--': true });

  const {
    _: positionalArgs = [],
    '--': unparsedArgs = [],
  } = parsedArgs;

  const exceptions: ValidationException[] = [
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
