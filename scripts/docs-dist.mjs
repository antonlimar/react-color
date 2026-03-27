import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, loadConfigFromFile } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const loadedConfig = await loadConfigFromFile(
    { command: 'build', mode: 'production' },
    path.resolve(__dirname, '../vite.docs.config.ts'),
  );

  if (!loadedConfig) {
    throw new Error('Failed to load Vite docs config from vite.docs.config.ts');
  }

  await build({
    ...loadedConfig.config,
    configFile: false,
  });
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
