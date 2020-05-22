import { getOrDefault } from '../lib/functions/object/getOrDefault';
import { Argument, ArgumentDefinition, ArgumentValue, InitialParsedArgs } from './_types';

export function mapArgs(
  initialParsedArgs: InitialParsedArgs, argDefs: ArgumentDefinition[]
): Map<string, Argument> {
  const argsMap = new Map<string, Argument>();
  const { _: positionalArgs } = initialParsedArgs;
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
  return argsMap;
}
