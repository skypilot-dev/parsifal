import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDirPath = path.dirname(thisFilePath);

import baseConfig, { createConfig } from '@williamthorsen/eslint-config-typescript';
import tseslint from 'typescript-eslint';

const TEST_FILES = ['src/**/*.test.ts'];

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  ...tseslint.config({
    extends: [baseConfig],
    rules: {
      'n/no-extraneous-import': 'off',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-useless-undefined': 'off',
    },
  }),
  {
    // Completely ignore these files
    ignores: [
      '**/*.sh', //
      '**/.next/**',
      '**/coverage/**',
      '**/dist/**',
      '**/local/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.md/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: thisDirPath,
      },
    },
    rules: {
      '@typescript-eslint/no-confusing-void-expression': [
        'warn',
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: true,
          ignoreVoidReturningFunctions: true,
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowBoolean: true,
          allowNumber: true,
        },
      ],
    },
  },
  ...tseslint.config({
    files: TEST_FILES,
    extends: [await createConfig.vitest()],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'vitest/consistent-test-filename': 'off',
      'vitest/padding-around-all': 'off',
      'vitest/padding-around-expect-groups': 'off',
    },
  }),
];
