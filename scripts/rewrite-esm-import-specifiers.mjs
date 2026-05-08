import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function collectImportFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectImportFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts'))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function getAliasedTarget(specifier) {
  if (!specifier.startsWith('@/')) {
    return null;
  }

  return path.join(repoRoot, 'es', specifier.slice(2));
}

async function resolveRelativeSpecifier(filePath, specifier) {
  const aliasedTarget = getAliasedTarget(specifier);

  if (aliasedTarget) {
    const sourceDir = path.dirname(filePath);
    const relativeSpecifier = path.relative(sourceDir, aliasedTarget).split(path.sep).join(path.posix.sep);
    specifier = relativeSpecifier.startsWith('.') ? relativeSpecifier : `./${relativeSpecifier}`;
  }

  if (!specifier.startsWith('.') || path.extname(specifier)) {
    return specifier;
  }

  const sourceDir = path.dirname(filePath);
  const absoluteTarget = path.resolve(sourceDir, specifier);
  const extension = filePath.endsWith('.d.ts') ? '.d.ts' : '.js';

  try {
    await readFile(`${absoluteTarget}${extension}`);
    return `${specifier}${extension}`;
  } catch (error) {
    if (!error || error.code !== 'ENOENT') {
      throw error;
    }
  }

  try {
    await readFile(path.join(absoluteTarget, `index${extension}`));
    return `${specifier}/index${extension}`;
  } catch (error) {
    if (!error || error.code !== 'ENOENT') {
      throw error;
    }
  }

  return specifier;
}

async function rewriteFile(filePath) {
  const source = await readFile(filePath, 'utf8');
  const matches = [
    ...source.matchAll(/\bfrom\s+(['"])(\.\/|\.\.\/|@\/)[^'"]*\1/gu),
    ...source.matchAll(/\bimport\s+(['"])(\.\/|\.\.\/|@\/)[^'"]*\1/gu),
  ];

  if (matches.length === 0) {
    return;
  }

  const replacements = new Map();

  await Promise.all(
    matches.map(async (match) => {
      const specifier = match[0].match(/['"]([^'"]+)['"]/u)?.[1];

      if (specifier) {
        replacements.set(specifier, await resolveRelativeSpecifier(filePath, specifier));
      }
    }),
  );

  let rewritten = source;

  for (const [specifier, replacement] of replacements) {
    if (specifier === replacement) {
      continue;
    }

    rewritten = rewritten
      .replaceAll(`'${specifier}'`, `'${replacement}'`)
      .replaceAll(`"${specifier}"`, `"${replacement}"`);
  }

  if (rewritten !== source) {
    await writeFile(filePath, rewritten);
  }
}

async function main() {
  const targetDir = process.argv[2];

  if (targetDir !== 'es') {
    throw new Error('Usage: node scripts/rewrite-esm-import-specifiers.mjs <es>');
  }

  const files = await collectImportFiles(path.join(repoRoot, targetDir));

  await Promise.all(files.map((filePath) => rewriteFile(filePath)));

  console.log(`Rewrote relative and aliased ESM import specifiers in ${files.length} ${targetDir} files.`);
}

await main();
