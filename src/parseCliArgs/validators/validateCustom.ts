import { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';

export function validateCustom(
  value: ArgumentValue | ArgumentValue[], argDef: ArgumentDefinition,
): ValidationException[] {
  if (!Array.isArray(value) && typeof value === 'undefined') {
    /* An undefined value, if not permitted, will be flagged as a missing required value,
       so it isn't reported as an exception here. */
    return [];
  }

  const { validate } = argDef;
  if (!validate) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  function resolveValidationResult<R extends { errors?: string[]; ok: boolean }>(
    result: boolean | R
  ): R | { errors?: string[]; ok: boolean } {
    return typeof result === 'boolean' ? { errors: [], ok: result } : result;
  }

  const errorValidationResults = values
    .map(value => resolveValidationResult(validate(value)))
    .filter(({ ok }) => !ok);

  return errorValidationResults.map(validationResult => {
    const { errors = [] } = validationResult;
    return {
      code: 'badValue',
      level: 'error',
      message: [
        `Invalid value for '${argDef.name}'`,
        ...(errors.length ? [errors.join('; ')] : []),
      ].join(': '),
      identifiers: [argDef.name],
    };
  });
}
