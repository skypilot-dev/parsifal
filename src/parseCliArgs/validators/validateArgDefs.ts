import { ArgumentDefinition, ValidationException } from '../_types';
import { disallowDefaultWithRequired } from './disallowDefaultWithRequired';

/* TODO: Check that `defaultValue` and `validValues` are consistent. */
/* TODO: Check that `defaultValue` and `valueType` are consistent. */
/* TODO: Check that `validValues` and `valueType` are consistent. */

export function validateArgDefs(
  argumentDefs: ArgumentDefinition[]
): ValidationException[] {
  return [
    ...disallowDefaultWithRequired(argumentDefs),
  ];
}
