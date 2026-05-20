// This file has been automatically migrated to valid ESM format by Storybook.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import { mergeConfig, transformWithOxc } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function jsxInJsPlugin() {
  return {
    name: 'react-color-storybook-jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\/(src|\.storybook)\/.*\.js$/.test(id)) {
        return null;
      }

      const result = await transformWithOxc(code, id, {
        lang: 'jsx',
        jsx: {
          runtime: 'automatic',
          development: true,
        },
      });

      for (const warning of result.warnings) {
        this.warn(warning);
      }

      return {
        code: result.code,
        map: result.map,
        moduleType: 'js',
      };
    },
  };
}

/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ['../src/components/**/story.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      plugins: [jsxInJsPlugin(), babel({ presets: [reactCompilerPreset()] })],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@storybook-utils': path.resolve(__dirname),
          '@test': path.resolve(__dirname, '../test'),
        },
      },
    });
  },
};

export default config;
