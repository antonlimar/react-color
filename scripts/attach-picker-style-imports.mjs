import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function collectGeneratedModules(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectGeneratedModules(absolutePath)));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts'))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function rewriteScssImports(source, { stripOnly = false } = {}) {
  return source.replace(/^import\s+(['"])([^'"]+)\.scss\1;\r?\n/gmu, (_match, quote, specifier) =>
    stripOnly ? '' : `import ${quote}${specifier}.css${quote};\n`,
  );
}

async function rewriteFile(filePath) {
  const source = await readFile(filePath, 'utf8');
  const rewritten = rewriteScssImports(source, { stripOnly: filePath.endsWith('.d.ts') });

  if (rewritten !== source) {
    await writeFile(filePath, rewritten);
  }
}

async function main() {
  const targetDir = process.argv[2];

  if (targetDir !== 'es') {
    throw new Error('Usage: node scripts/attach-picker-style-imports.mjs <es>');
  }

  const files = await collectGeneratedModules(path.join(repoRoot, targetDir));

  await Promise.all(files.map((filePath) => rewriteFile(filePath)));

  console.log(`Rewrote SCSS side effects in ${files.length} ${targetDir} modules.`);
}

await main();
