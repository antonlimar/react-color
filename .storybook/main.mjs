import { mergeConfig, transformWithOxc } from 'vite';

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
      plugins: [jsxInJsPlugin()],
    });
  },
};

export default config;
