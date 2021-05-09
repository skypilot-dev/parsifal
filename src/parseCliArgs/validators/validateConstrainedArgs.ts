import { Argument, ValidationException } from '../_types';
import { validateConstrainedValue } from './validateConstrainedValue';
import { validateCustom } from './validateCustom';

export function validateConstrainedArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return Array.from(argsMap.entries())
    .filter(([_name, argument]) => !!argument.definition.validValues || !!argument.definition.validate)
    .reduce((accExceptions, [_name, argument]) => {
      const { definition, value } = argument;
      return [
        ...accExceptions,
        ...validateConstrainedValue(value, definition),
        ...validateCustom(value, definition),
      ];
    }, [] as ValidationException[]);
}
