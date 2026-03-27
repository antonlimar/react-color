import { build } from 'vite';
import viteConfig from '../vite.docs.config.mjs';

build({
  ...viteConfig,
  configFile: false,
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
