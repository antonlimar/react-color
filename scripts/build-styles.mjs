import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { compileAsync } from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const stylesRoot = path.join(repoRoot, 'src', 'styles');

async function collectEntries(currentDir = stylesRoot) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const results = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name.startsWith('_')) {
      continue;
    }

    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await collectEntries(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.scss')) {
      results.push(fullPath);
    }
  }

  return results;
}

function getOutputPath(targetDir, entryPath) {
  const relativePath = path.relative(stylesRoot, entryPath).replace(/\.scss$/u, '.css');

  return path.join(repoRoot, targetDir, 'styles', relativePath);
}

async function compileEntry(entryPath, targetDir) {
  const outputPath = getOutputPath(targetDir, entryPath);
  const { css } = await compileAsync(entryPath, {
    loadPaths: [stylesRoot],
    style: 'expanded',
  });

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, css);
}

async function main() {
  const targetDir = process.argv[2];

  if (targetDir !== 'es') {
    throw new Error('Usage: node scripts/build-styles.mjs <es>');
  }

  const entries = await collectEntries();

  await Promise.all(entries.map((entryPath) => compileEntry(entryPath, targetDir)));

  console.log(`Built ${entries.length} style entrypoints into ${targetDir}/styles.`);
}

await main();
