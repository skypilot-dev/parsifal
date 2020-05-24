import { ArgumentDefinition, ValidationException } from '../_types';
import { disallowDefaultWithRequired } from './disallowDefaultWithRequired';
import { disallowUnlistedDefault } from './disallowUnlistedDefault';
import { disallowWrongTypeDefault } from './disallowWrongTypeDefault';
import { disallowWrongTypeListed } from './disallowWrongTypeListed';

export function validateArgDefs(
  argumentDefs: ArgumentDefinition[]
): ValidationException[] {
  return [
    ...disallowDefaultWithRequired(argumentDefs),
    ...disallowUnlistedDefault(argumentDefs),
    ...disallowWrongTypeDefault(argumentDefs),
    ...disallowWrongTypeListed(argumentDefs),
  ];
}
