import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer, loadConfigFromFile } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 9100;
const docsIndexPath = path.resolve(__dirname, '../docs/index.html');
const devEntryTag = '<script type="module" src="/index.js"></script>';
const prodEntryPattern = /<script\s+src="build\/bundle\.js"\s+type="text\/javascript"><\/script>/;

async function start() {
  const loadedConfig = await loadConfigFromFile(
    { command: 'serve', mode: 'development' },
    path.resolve(__dirname, '../vite.docs.config.ts'),
  );

  if (!loadedConfig) {
    throw new Error('Failed to load Vite docs config from vite.docs.config.ts');
  }

  const viteConfig = loadedConfig.config;
  let vite;

  const server = http.createServer(async (req, res) => {
    const url = req.url || '/';

    if (url === '/' || url === '/index.html') {
      try {
        let html = await fs.readFile(docsIndexPath, 'utf8');
        html = html.replace(prodEntryPattern, devEntryTag);
        html = await vite.transformIndexHtml(url, html);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        res.statusCode = 500;
        res.end(error.stack);
      }
      return;
    }

    vite.middlewares(req, res, () => {
      res.statusCode = 404;
      res.end();
    });
  });

  vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    appType: 'custom',
    server: {
      ...viteConfig.server,
      middlewareMode: true,
      hmr: {
        server,
      },
    },
  });

  server.listen(port, 'localhost', () => {
    console.log('[vite]', `http://localhost:${port}/`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
