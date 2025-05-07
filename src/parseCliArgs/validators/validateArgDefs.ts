import type { ArgumentDefinition, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { disallowDefaultWithRequired } from '~src/parseCliArgs/validators/disallowDefaultWithRequired.ts';
import { disallowUnlistedDefault } from '~src/parseCliArgs/validators/disallowUnlistedDefault.ts';
import { disallowWrongTypeDefault } from '~src/parseCliArgs/validators/disallowWrongTypeDefault.ts';
import { disallowWrongTypeListed } from '~src/parseCliArgs/validators/disallowWrongTypeListed.ts';

export function validateArgDefs(argumentDefs: ArgumentDefinition[]): ValidationException[] {
  return [
    ...disallowDefaultWithRequired(argumentDefs),
    ...disallowUnlistedDefault(argumentDefs),
    ...disallowWrongTypeDefault(argumentDefs),
    ...disallowWrongTypeListed(argumentDefs),
  ];
}
