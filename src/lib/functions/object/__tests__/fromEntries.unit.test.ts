import { fromEntries } from '../fromEntries';

describe('fromEntries(entries)', () => {
  it('should create an object from the entries and return it', () => {
    const entries = [
      ['a', 1],
      ['b', 2],
    ] as const;

    const obj = fromEntries(entries);

    const expected = { a: 1, b: 2 };
    expect(obj).toStrictEqual(expected);
  });

  it('can use numbers as keys', () => {
    const entries = [
      [1, 'a'],
      [2, 'b'],
    ] as const;

    const obj = fromEntries(entries);

    const expected = { '1': 'a', '2': 'b' };
    expect(obj).toStrictEqual(expected);
  });

  it('can use symbols as keys', () => {
    const entries = [
      [Symbol.for('1'), 1],
      [Symbol.for('2'), 2],
    ] as const;

    const obj = fromEntries(entries);

    const expected = { [Symbol.for('1')]: 1, [Symbol.for('2')]: 2 };
    expect(obj).toStrictEqual(expected);
  });
});
