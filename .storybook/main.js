const { mergeConfig, transformWithOxc } = require('vite')

function jsxInJsPlugin() {
  return {
    name: 'react-color-storybook-jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\/(src|\.storybook)\/.*\.js$/.test(id)) {
        return null
      }

      return transformWithOxc(code, id, {
        lang: 'jsx',
        jsx: {
          runtime: 'classic',
          refresh: true,
        },
      })
    },
  }
}

/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ['../src/components/**/story.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: false,
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      plugins: [jsxInJsPlugin()],
    })
  },
}

module.exports = config
