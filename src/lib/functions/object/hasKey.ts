/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function hasKey(obj: { [key: string]: any }, keys: string[]): boolean {
  let o = obj;
  for (const key of keys.slice(0, -1)) {
    o = o[key] || {};
  }

  const key = keys.at(-1);
  return key === undefined ? false : Object.hasOwn(o, key);
}
