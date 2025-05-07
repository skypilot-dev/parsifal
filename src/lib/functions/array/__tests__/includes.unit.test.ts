import { describe, expect, it } from 'vitest';

import { includes } from '../includes.ts';

// eslint-disable-next-line unicorn/no-null
const NULL = null;

describe('includes()', () => {
  it('returns true if the array includes the item', () => {
    const arr = [1, 2, 3];

    expect(arr).toContain(2);
  });

  it('returns false if the array does not include the item', () => {
    const arr = [1, 2, 3];

    expect(arr).not.toContain(4);
  });

  it('works correctly with readonly arrays', () => {
    const arr = ['a', 'b', 'c'] as const;

    expect(includes(arr, 'b')).toBe(true);
    expect(includes(arr, 'd')).toBe(false);
  });

  it('works correctly with array of different types', () => {
    const arr = [1, 'a', true, NULL, undefined] as const;

    expect(includes(arr, 1)).toBe(true);
    expect(includes(arr, 'a')).toBe(true);
    expect(includes(arr, true)).toBe(true);
    expect(includes(arr, NULL)).toBe(true);
    expect(includes(arr, undefined)).toBe(true);
  });
});
