import { describe, expect, it } from 'vitest';

import * as module from '~src/index.ts';

describe('index.ts', () => {
  it('exports a module', () => {
    expect(typeof module).toBe('object');
  });
});
