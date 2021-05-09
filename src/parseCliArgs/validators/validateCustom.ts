import { ArgumentDefinition, ArgumentValue, ValidationException } from '../_types';

export function validateCustom(
  value: ArgumentValue, argDef: ArgumentDefinition,
): ValidationException[] {
  if (value === undefined) {
    /* An undefined value, if not permitted, will be flagged as a missing required value,
       so it isn't reported as an exception here. */
    return [];
  }
  if (argDef.validate) {
    const validationResult = argDef.validate(value);
    const resolvedResult = typeof validationResult === 'boolean' ? { ok: validationResult }
      : validationResult;

    if (!resolvedResult.ok) {
      const { errors = [] } = resolvedResult;
      return [{
        code: 'badValue',
        level: 'error',
        message: [
          `Invalid value for '${argDef.name}'`,
          ...(errors.length ? [errors.join('; ')] : []),
        ].join(': '),
        identifiers: [argDef.name],
      }];
    }
  }
  return [];
}
