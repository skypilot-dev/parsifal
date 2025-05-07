import type { ArgumentDefinition, ArgumentValue, ValidationException } from '~src/parseCliArgs/_types/index.ts';

export function validateRange(
  value: ArgumentValue | ArgumentValue[],
  argDef: ArgumentDefinition,
): ValidationException[] {
  if (!Array.isArray(value) && value === undefined) {
    // An undefined value, if not permitted, will be flagged as a missing required value,
    // so it isn't reported as an exception here.
    return [];
  }

  const { validRange } = argDef;

  if (!validRange) {
    return [];
  }

  if (validRange.length !== 2) {
    const rangeDescription = Array.isArray(validRange) ? validRange.join(', ') : validRange;
    throw new Error(`Invalid range: ${rangeDescription}`);
  }

  const [minValue, maxValue] = validRange;
  const values = Array.isArray(value) ? value : [value];

  return (
    values
      // @ts-expect-error - Types need to be adjusted to reflect that comparands will be of the same type.
      .filter((item) => item === undefined || item < minValue || item > maxValue)
      .map((item) => ({
        code: 'outOfRangeValue',
        level: 'error',
        message: `Invalid value ${JSON.stringify(item)} for '${argDef.name}': Valid range is ${minValue}-${maxValue}`,
        identifiers: [argDef.name],
      }))
  );
}
