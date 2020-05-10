/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function hasKey (obj: { [key: string]: any }, keys: string[]): boolean {
  let o = obj;
  keys.slice(0, -1).forEach(function (key) {
    o = (o[key] || {});
  });

  const key = keys[keys.length - 1];
  return key in o;
}
