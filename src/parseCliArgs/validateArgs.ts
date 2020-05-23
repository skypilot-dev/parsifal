import { Argument, ValidationException } from './_types';
import { validateConstrainedArgs } from './validators/validateConstrainedArgs';
import { validateRequiredArgs } from './validators/validateRequiredArgs';
import { validateTypedArgs } from './validators/validateTypedArgs';

export function validateArgs(argsMap: Map<string, Argument>): ValidationException[] {
  return [
    ...validateRequiredArgs(argsMap),
    ...validateConstrainedArgs(argsMap),
    ...validateTypedArgs(argsMap),
  ];
}
