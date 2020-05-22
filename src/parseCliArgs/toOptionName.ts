import { Integer } from '@skypilot/common-types';
import { ArgumentDefV1 } from './_types';

export function toOptionName(
  argDefInput: ArgumentDefV1 | string | undefined,
  index: Integer = 0
): string {
  if (typeof argDefInput === 'string') {
    return argDefInput;
  }
  if (typeof argDefInput === 'object' && argDefInput?.name) {
    return argDefInput.name;
  }
  return index.toString();
}
