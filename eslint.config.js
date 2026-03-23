const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  {
    ignores: ['docs/build/**', '.out/**', 'es/**', 'lib/**', 'node_modules/**', 'examples/**/dist/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
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
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      'no-magic-numbers': 'off',
      'react/prop-types': 'off',
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
      '@typescript-eslint/no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },
  {
    files: [
      '.storybook/**/*.{js,jsx,ts,tsx}',
      'eslint.config.js',
      'scripts/**/*.{js,mjs}',
      'vite.docs.config.js',
      'vitest.config.js',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['examples/**/*.{js,jsx,ts,tsx,mjs}'],
    rules: {
      'react/no-deprecated': 'off',
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
  {
    files: ['src/components/common/ColorWrap.tsx'],
    rules: {
      'react-hooks/unsupported-syntax': 'off',
    },
  },
  eslintPluginPrettierRecommended,
]);
