import { ArgumentDefinition, ValidationException } from '../_types';
import { disallowDefaultWithRequired } from './disallowDefaultWithRequired';
import { disallowUnlistedDefault } from './disallowUnlistedDefault';
import { disallowWrongTypeDefault } from './disallowWrongTypeDefault';

/* TODO: Check that `validValues` and `valueType` are consistent. */

export function validateArgDefs(
  argumentDefs: ArgumentDefinition[]
): ValidationException[] {
  return [
    ...disallowDefaultWithRequired(argumentDefs),
    ...disallowUnlistedDefault(argumentDefs),
    ...disallowWrongTypeDefault(argumentDefs),
  ];
}
