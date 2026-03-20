const { defineConfig } = require('vitest/config')
const { transformWithOxc } = require('vite')

module.exports = defineConfig({
  plugins: [
    {
      name: 'react-color-jsx-pretransform',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/(src|test)\/.*\.(js|jsx)$/.test(id)) {
          return null
        }

        return transformWithOxc(code, id, {
          lang: 'jsx',
          jsx: {
            runtime: 'classic',
            refresh: false,
          },
        })
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/spec.{js,jsx}', 'src/helpers/spec.js'],
    setupFiles: ['./test/vitest.setup.mjs'],
    clearMocks: true,
    restoreMocks: true,
  },
})
