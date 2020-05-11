/* eslint-disable @typescript-eslint/no-explicit-any */
export function isNumber (x: any): boolean {
  if (typeof x === 'number') {
    return true;
  }
  if (/^0x[0-9a-f]+$/i.test(x)) {
    return true;
  }
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}
