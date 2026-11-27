import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import jest from 'eslint-plugin-jest';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['tests/**/*.ts'],
    ...jest.configs['flat/recommended'],
  },
  {
    files: ['**/*.{ts,tsx,mjs}'],
    rules: {
      'import/no-cycle': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      '@typescript-eslint/no-inferrable-types': 'off',
      'prefer-const': 'warn',
    },
  },
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '**/*.js',
    '.idea/**',
    '.claude/**',
    '.yarn/**',
    'tests/test-report.html',
    'coverage/**',
  ]),
]);
