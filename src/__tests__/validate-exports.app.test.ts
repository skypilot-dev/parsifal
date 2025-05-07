import { describe, expect, it } from 'vitest';

import * as actualExports from '~src/index.ts';

const intendedExports: string[] = [
  /* Parser */
  'parseCliArgs',
];

describe('Validate exports', () => {

  const actualExportNames = Object.keys(actualExports);

  it('exports include all intended exports', () => {
    for (const exportName of intendedExports) {
      expect(actualExportNames).toContain(exportName);
    }
  });


  it('exports do not include any unintended exports', () => {
    for (const exportName of actualExportNames) {
      expect(intendedExports).toContain(exportName);
    }
  });
});
