import { Argument, ValidationException } from '../_types';
import { validateConstrainedValue } from './validateConstrainedValue';

export function validateConstrainedArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return Array.from(argsMap.entries())
    .filter(([_name, argument]) => !!argument.definition.validValues)
    .reduce((accExceptions, [_name, argument]) => {
      const { definition, value } = argument;
      return [
        ...accExceptions,
        ...validateConstrainedValue(value, definition),
      ];
    }, [] as ValidationException[]);
}
