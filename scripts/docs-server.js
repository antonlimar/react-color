'use strict';

const fs = require('fs/promises');
const http = require('http');
const path = require('path');
const { createServer: createViteServer } = require('vite');
const viteConfig = require('../vite.docs.config');

const port = 9100;
const docsIndexPath = path.resolve(__dirname, '../docs/index.html');
const devEntryTag = '<script type="module" src="/index.js"></script>';
const prodEntryPattern = /<script\s+src="build\/bundle\.js"\s+type="text\/javascript"><\/script>/;

async function start() {
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
