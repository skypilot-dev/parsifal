import { ArgumentDefinition, ValidationException } from '../_types';
import { hasCorrectType } from './hasCorrectType';

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
