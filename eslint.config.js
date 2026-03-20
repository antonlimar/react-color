const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig } = require("eslint/config");
const reactHooks = require("eslint-plugin-react-hooks");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  {
    ignores: ["es/**", "lib/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.{js,jsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
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
    rules: {
      "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
      "no-magic-numbers": "off",
      "react-hooks/rules-of-hooks": reactHooks.configs.flat.recommended.rules["react-hooks/rules-of-hooks"],
      "react-hooks/exhaustive-deps": reactHooks.configs.flat.recommended.rules["react-hooks/exhaustive-deps"],
    },
  },
  {
    files: ["src/**/*.spec.{js,jsx}", "src/**/spec.{js,jsx}", "src/**/story.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-redeclare": "off",
    },
  },
]);
