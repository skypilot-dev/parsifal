import type { ArgumentValue, EchoOptions, EchoParams } from '../_types';

// Given an arguments map and options, return a corresponding `EchoParams` object
export function toEchoParams(
  argValuesMap: Map<string, ArgumentValue>,
  options: EchoOptions | boolean = false
): EchoParams {
  if (typeof options === 'boolean') {
    return { echoUndefined: false, shouldEcho: options };
  }
  const { echoUndefined = false, echoIf = false } = options;
  return {
    echoUndefined,
    shouldEcho: typeof echoIf === 'boolean' ? echoIf : !!echoIf(argValuesMap),
  };
}
