/* eslint-disable no-console */

import type { Argument, ValidationException } from './_types';
import { formatArgsUse } from './formatters/formatArgsUse';
import { valueTypeIsArray } from './valueTypeIsArray';

type ShowUsageOptions = {
  argsMap: Map<string, Argument>;
  command?: string;
  exceptions?: ValidationException[];
  exitCode?: number;
  exitProcessWhenTesting?: boolean;
  message?: string;
}

export function showUsage(options: ShowUsageOptions): never {
  const {
    argsMap,
    command = 'command',
    exceptions = [],
    exitCode = 0,
    exitProcessWhenTesting, // if true, call `process.exit()` even when running in test mode
    message = exceptions.map(({ message }) => message).join('\n'),
  } = options;
  const writeToDisplay = exitCode ? console.log : console.error;

  const requiredNamedArgUsage = formatArgsUse(Array.from(argsMap.values())
    .filter(argument => !argument.definition.positional && argument.definition.required)
    .map(argument => argument.definition));

  const optionalNamedArgUsage = formatArgsUse(Array.from(argsMap.values())
    .filter(argument => !argument.definition.positional && !argument.definition.required)
    .map(argument => argument.definition));

  const positionalArgUsage = formatArgsUse(Array.from(argsMap.values())
    .filter(argument => !!argument.definition.positional)
    .map(argument => argument.definition));

  const usageTitle = [`Usage: ${command}`];
  const usageDetails = [];
  if (requiredNamedArgUsage) {
    usageTitle.push('<required arguments>');
    usageDetails.push('', requiredNamedArgUsage);
  }
  if (optionalNamedArgUsage) {
    usageTitle.push('[optional arguments]');
    usageDetails.push(
      '\n  optional arguments:',
      optionalNamedArgUsage
    );
  }

  if (positionalArgUsage) {
    const positionalArgNames = Array.from(argsMap.values())
      .filter(argument => argument.definition.positional)
      .map(argument => argument.definition.name);
    usageTitle.push(`[--] [${positionalArgNames.join(' ')}]`);
    usageDetails.push(
      '\n  positional arguments:',
      positionalArgUsage
    );
  }

  const includeArrayExplanation = Array.from(argsMap.values())
    .some(argument => valueTypeIsArray(argument.definition.valueType));

  const usage = [
    usageTitle.join(' '),
    ...usageDetails,
    ...(includeArrayExplanation ? ['\n(Enter arrays as comma-separated values without spaces; e.g.: --arg=value1,value2)'] : []),
  ].join('\n');
  console.log(usage);
  if ((message || exitCode) && !exitProcessWhenTesting) {
    if (process.env.NODE_ENV === 'test') {
      throw new Error(message);
    }
    writeToDisplay(`Error: ${message}`);
  }
  process.exit(exitCode);
}
