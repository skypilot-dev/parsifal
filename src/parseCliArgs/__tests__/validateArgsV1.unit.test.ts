import { validateArgsV1 } from '../validateArgsV1';

describe('validationArgs()', () => {
  it('should throw an error if a required argument is missing', () => {
    const argMap = { b: 1 }
    const argDefs = [
      { name: 'a', required: true },
      { name: 'b' },
    ];

    expect(() => {
      validateArgsV1(argDefs, argMap);
    }).toThrow();
  });

  it('should not throw if all required arguments are present', () => {
    const argMap = { a: 1, b: 'two' }
    const argDefs = [
      { name: 'a', required: true },
      { name: 'b', required: true },
    ];

    expect(() => {
      validateArgsV1(argDefs, argMap);
    }).not.toThrow();
  });

  it('should not throw if no arguments are given or required', () => {
    const argMap = {}
    const argDefs: { name: string }[] = [];

    expect(() => {
      validateArgsV1(argDefs, argMap);
    }).not.toThrow();
  });
});
