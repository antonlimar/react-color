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
      reactHooks.configs.flat.recommended,
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
      'import-x/no-unresolved': ['error', { ignore: ['^@/', '^@test/', '^@storybook-utils/'] }],
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'index', 'sibling', 'object', 'unknown'],
          pathGroups: [
            { pattern: 'react*', group: 'external', position: 'before' },
            { pattern: '*', group: 'external', position: 'before' },
            { pattern: 'type *', group: 'external', position: 'before' },
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
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      'no-magic-numbers': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/**/*.spec.{js,jsx,ts,tsx}', 'src/**/spec.{js,jsx,ts,tsx}', 'src/**/story.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-redeclare': 'off',
    },
  },
  {
    files: ['test/**/*.{js,jsx,ts,tsx,mjs}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  eslintPluginPrettierRecommended,
]);
