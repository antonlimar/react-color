'use strict';

const { build } = require('vite');
const viteConfig = require('../vite.docs.config');

build({
  ...viteConfig,
  configFile: false,
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
