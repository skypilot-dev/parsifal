import { describe, expect, it } from 'vitest';

import type { ArgumentValue } from '~src/parseCliArgs/_types/index.ts';
import { toEchoParams } from '~src/parseCliArgs/utils/toEchoParams.ts';

const argValuesMap = new Map([['verbose', true]]);

describe(toEchoParams, () => {
  it('if `options` is boolean, returns `shouldEcho: !!options`', () => {
    const echoFalseParams = toEchoParams(argValuesMap, false);
    expect(echoFalseParams).toStrictEqual({ echoUndefined: false, shouldEcho: false });

    const echoTrueParams = toEchoParams(argValuesMap, true);
    expect(echoTrueParams).toStrictEqual({ echoUndefined: false, shouldEcho: true });

    const echoUndefinedParams = toEchoParams(argValuesMap, undefined);
    expect(echoUndefinedParams).toStrictEqual({ echoUndefined: false, shouldEcho: false });
  });

  it('if `options: echoIf` is boolean or undefined, returns `shouldEcho: !!echoIf`', () => {
    const echoIfFalseParams = toEchoParams(argValuesMap, { echoUndefined: true, echoIf: false });
    expect(echoIfFalseParams).toStrictEqual({ echoUndefined: true, shouldEcho: false });

    const echoIfTrueParams = toEchoParams(argValuesMap, { echoUndefined: false, echoIf: true });
    expect(echoIfTrueParams).toStrictEqual({ echoUndefined: false, shouldEcho: true });

    const echoUndefinedParams = toEchoParams(argValuesMap, {});
    expect(echoUndefinedParams).toStrictEqual({ echoUndefined: false, shouldEcho: false });
  });

  it('if `options: echoIf` is a function, returns `shouldEcho: [evaluated function]`', () => {
    const echoIfVerbose = (argsDict: Map<string, ArgumentValue | ArgumentValue[]>): boolean | undefined =>
      !!argsDict.get('verbose');

    const echoParams = toEchoParams(argValuesMap, { echoIf: echoIfVerbose });
    expect(echoParams).toStrictEqual({ echoUndefined: false, shouldEcho: true });
  });
});
