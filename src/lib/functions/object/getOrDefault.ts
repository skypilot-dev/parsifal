export function getOrDefault<T>(
  map: { [key: string]: T },
  key: string,
  defaultValue: T | undefined = undefined
): T | undefined {
  return Object.prototype.hasOwnProperty.call(map, key)
    ? map[key] as T | undefined
    : defaultValue;
}
