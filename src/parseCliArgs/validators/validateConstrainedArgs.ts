import { Argument, ValidationException } from '../_types';
import { validateConstrainedValue } from './validateConstrainedValue';
import { validateCustom } from './validateCustom';
import { validateRange } from './validateRange';

export function validateConstrainedArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return Array.from(argsMap.entries())
    .filter(([_name, argument]) => !!(
      argument.definition.validate
      || argument.definition.validRange
      || argument.definition.validValues
    ))
    .reduce((accExceptions, [_name, argument]) => {
      const { definition, value } = argument;
      return [
        ...accExceptions,
        ...validateConstrainedValue(value, definition),
        ...validateCustom(value, definition),
        ...validateRange(value, definition),
      ];
    }, [] as ValidationException[]);
}
