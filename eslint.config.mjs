import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { createNodeResolver, importX } from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs as storybookConfigs } from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: [
      '.cache/**',
      '.out/**',
      '.vite/**',
      'coverage/**',
      'dist/**',
      'es/**',
      'lib/**',
      'node_modules/**',
      'playwright-report/**',
      'site/dist/**',
      'test-results/**',
    ],
  },
  ...storybookConfigs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat['recommended-latest'],
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
    ],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      'import-x/resolver-next': [createNodeResolver({ extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'] })],
      react: {
        version: 'detect',
      },
    },
    rules: {
      'import-x/no-unresolved': ['error', { ignore: ['^@/', '^@test/', '^@storybook-utils/', '^react-color-x$'] }],
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'index', 'sibling', 'object', 'unknown'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'after' },
            { pattern: '@/**', group: 'internal', position: 'after' },
            { pattern: './*.scss', group: 'unknown', position: 'after' },
            { pattern: '../*.scss', group: 'unknown', position: 'after' },
          ],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
          warnOnUnassignedImports: true,
        },
      ],
      'import-x/no-cycle': 'error',
      'import-x/no-duplicates': 'error',
      'no-nested-ternary': 'error',
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      'react/react-in-jsx-scope': 'off',
    },
  },
  eslintPluginPrettierRecommended,
]);
