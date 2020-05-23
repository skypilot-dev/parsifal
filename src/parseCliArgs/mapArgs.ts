import { getOrDefault } from '../lib/functions/object/getOrDefault';
import { Argument, ArgumentDefinition, ArgumentValue, InitialParsedArgs } from './_types';

interface MapArgsOptions {
  mapAllNamedArgs?: boolean;
}

export function mapArgs(
  initialParsedArgs: InitialParsedArgs,
  argDefs: ArgumentDefinition[],
  options: MapArgsOptions = {}
): Map<string, Argument> {
  const { mapAllNamedArgs = false } = options;

  const argsMap = new Map<string, Argument>();
  const { _: positionalArgs, '--': _unparsedArgs, ...namedArgsMap } = initialParsedArgs;

  const namedArgDefs = argDefs.filter(({ positional }) => !positional);
  const positionalArgDefs = argDefs.filter(({ positional }) => !!positional);

  positionalArgDefs.forEach((definition: ArgumentDefinition, index) => {
    const { defaultValue, name } = definition;
    argsMap.set(name, {
      definition,
      value: positionalArgs.length > index ? positionalArgs[index] : defaultValue,
    });
  });

  namedArgDefs.forEach(definition => {
    const { defaultValue, name } = definition;
    argsMap.set(name, {
      definition,
      value: getOrDefault(initialParsedArgs, name, defaultValue) as ArgumentValue | undefined,
    });
  });

  if (mapAllNamedArgs) {
    Object.entries(namedArgsMap)
      .filter(([name]) => !argsMap.has(name))
      .forEach(([name, value]) => {
        argsMap.set(name, {
          definition: { name }, // create a definition on the fly
          value: value as ArgumentValue,
        });
      });
  }
  return argsMap;
}
