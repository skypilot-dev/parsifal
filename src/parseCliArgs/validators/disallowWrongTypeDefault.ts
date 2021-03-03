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
    return [
      ...accExceptions,
      {
        code: 'badDefinition',
        level: 'error',
        message: `Bad definition for ${name}: The default value is not of ${valueType} type`,
        identifiers: [name],
      },
    ];
  }, [] as ValidationException[]);
}
