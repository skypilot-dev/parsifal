import type { ArgumentDefinition, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { hasCorrectType } from '~src/parseCliArgs/validators/hasCorrectType.ts';

export function disallowWrongTypeDefault(
  argDefs: ArgumentDefinition[]
): ValidationException[] {
  return argDefs.reduce((accExceptions, argDef) => {
    const { defaultValue, name, valueType } = argDef;

    if (defaultValue === undefined || valueType === undefined || hasCorrectType(valueType, defaultValue)) {
      return accExceptions;
    }

    const typeDescription = (() => {
      switch (valueType) {
        case 'stringArray':
          return 'a string array';
        case 'integerArray':
          return 'an integer array';
        default:
          return `of ${valueType} type`;
      }
    })();

    return [
      ...accExceptions,
      {
        code: 'badDefinition',
        level: 'error',
        message: `Bad definition for ${name}: The default value is not ${typeDescription}`,
        identifiers: [name],
      },
    ];
  }, [] as ValidationException[]);
}
