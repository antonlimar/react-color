import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const sharedDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(sharedDir, '..');

export function createExampleConfig({ exampleDir }: { exampleDir: string }) {
  const reactEntry = path.resolve(exampleDir, 'node_modules/react');
  const reactDomEntry = path.resolve(exampleDir, 'node_modules/react-dom');
  const packageRoot = path.resolve(exampleDir, 'node_modules/react-color');
  const libraryEntry = path.resolve(packageRoot, 'es/index.js');
  const commonLibEntry = path.resolve(packageRoot, 'lib/components/common/index.js');
  const commonEsEntry = path.resolve(packageRoot, 'es/components/common/index.js');

  return defineConfig({
    plugins: [react({ jsxRuntime: 'automatic' })],
    resolve: {
      alias: [
        { find: 'react', replacement: reactEntry },
        { find: 'react-dom', replacement: reactDomEntry },
        { find: /^react-color$/, replacement: libraryEntry },
        { find: /^react-color\/lib\/components\/common$/, replacement: commonLibEntry },
        { find: /^react-color\/es\/components\/common$/, replacement: commonEsEntry },
      ],
      dedupe: ['react', 'react-dom'],
    },
    server: {
      fs: {
        allow: [repoRoot, exampleDir],
      },
    },
  });
}
