import { describe, expect, it } from 'vitest';

import * as module from '../index';

describe('index.ts', () => {
  it('exports a module', () => {
    expect(typeof module).toBe('object');
  });
});
