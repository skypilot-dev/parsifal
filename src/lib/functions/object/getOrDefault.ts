import { ArgumentsMap, ArgumentValue } from '../../../parseCliArgs/_types';

export function getOrDefault<T extends ArgumentValue>(
  argsMap: ArgumentsMap,
  key: string,
  defaultValue: T | undefined = undefined
): T | undefined {
  return Object.prototype.hasOwnProperty.call(argsMap, key)
    ? argsMap[key] as T | undefined
    : defaultValue;
}
