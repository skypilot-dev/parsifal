export function isNumber(x: unknown): boolean {
  if (typeof x === 'number') {
    return true;
  }
  if (typeof x !== 'string') {
    return false;
  }
  if (/^0x[0-9a-f]+$/i.test(x)) {
    return true;
  }
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}
