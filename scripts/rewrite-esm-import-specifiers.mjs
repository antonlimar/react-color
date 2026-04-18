import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function collectJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectJavaScriptFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(absolutePath);
    }
  }

  return files;
}

async function resolveRelativeSpecifier(filePath, specifier) {
  if (!specifier.startsWith('.') || path.extname(specifier)) {
    return specifier;
  }

  const sourceDir = path.dirname(filePath);
  const absoluteTarget = path.resolve(sourceDir, specifier);

  try {
    await readFile(`${absoluteTarget}.js`);
    return `${specifier}.js`;
  } catch (error) {
    if (!error || error.code !== 'ENOENT') {
      throw error;
    }
  }

  try {
    await readFile(path.join(absoluteTarget, 'index.js'));
    return `${specifier}/index.js`;
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
    ...source.matchAll(/\bfrom\s+(['"])(\.[^'"]+)\1/gu),
    ...source.matchAll(/\bimport\s+(['"])(\.[^'"]+)\1/gu),
  ];

  if (matches.length === 0) {
    return;
  }

  const replacements = new Map();

  await Promise.all(
    matches.map(async (match) => {
      replacements.set(match[2], await resolveRelativeSpecifier(filePath, match[2]));
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

  const files = await collectJavaScriptFiles(path.join(repoRoot, targetDir));

  await Promise.all(files.map((filePath) => rewriteFile(filePath)));

  console.log(`Rewrote relative ESM import specifiers in ${files.length} ${targetDir} files.`);
}

await main();
