import { getOrDefault } from '~src/lib/functions/object/getOrDefault.ts';
import type { Argument, ArgumentDefinition, InitialParsedArgs } from '~src/parseCliArgs/_types/index.ts';

interface MapArgsOptions {
  mapAllNamedArgs?: boolean;
}

export function mapArgs(
  initialParsedArgs: InitialParsedArgs,
  argDefs: ArgumentDefinition[],
  options: MapArgsOptions = {},
): Map<string, Argument> {
  const { mapAllNamedArgs = false } = options;

  const argsMap = new Map<string, Argument>();
  const { _: positionalArgs, '--': _unparsedArgs, ...namedArgsMap } = initialParsedArgs;

  const namedArgDefs = argDefs.filter(({ positional }) => !positional);
  const positionalArgDefs = argDefs.filter(({ positional }) => !!positional);

  for (const [index, definition] of positionalArgDefs.entries()) {
    const { defaultValue, name } = definition;
    argsMap.set(name, {
      definition,
      value: positionalArgs.length > index ? positionalArgs[index] : defaultValue,
    });
  }
  for (const definition of namedArgDefs) {
    const { defaultValue, name, valueType } = definition;
    const convertedValue = (() => {
      const enteredValue = getOrDefault(initialParsedArgs, name, undefined);
      switch (valueType) {
        case 'stringArray':
          return enteredValue === undefined
            ? undefined
            : typeof enteredValue === 'string'
              ? enteredValue.split(',')
              : [`${enteredValue}`];
        case 'integerArray':
          return enteredValue === undefined
            ? undefined
            : typeof enteredValue === 'number'
              ? [enteredValue]
              : typeof enteredValue === 'string'
                ? enteredValue.split(',').map((integerString) => Number.parseInt(integerString, 10))
                : [`${enteredValue}`];
        default:
          return enteredValue;
      }
    })();
    const value = convertedValue === undefined ? defaultValue : convertedValue;
    const argument: Argument = { definition, value };
    argsMap.set(name, argument);
  }

  if (mapAllNamedArgs) {
    for (const [name, value] of Object.entries(namedArgsMap).filter(([name]) => !argsMap.has(name))) {
      argsMap.set(name, {
        definition: { name }, // create a definition on the fly
        value,
      });
    }
  }
  fixBooleans(argsMap);
  return argsMap;
}

function fixBooleans(argsMap: Map<string, Argument>): Map<string, Argument> {
  for (const [_name, argument] of [...argsMap.entries()]
    .filter(([_name, argument]: [string, Argument]) => argument.value === 'true' || argument.value === 'false')
    .filter(([_name, argument]) => argument.definition.valueType === 'boolean')) {
    argument.value = argument.value === 'true';
  }
  return argsMap;
}
