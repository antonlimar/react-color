import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const pickerFiles = new Map([
  ['components/alpha/Alpha/index', 'alpha'],
  ['components/block/Block/index', 'block'],
  ['components/circle/Circle/index', 'circle'],
  ['components/chrome/Chrome/index', 'chrome'],
  ['components/compact/Compact/index', 'compact'],
  ['components/github/Github/index', 'github'],
  ['components/google/Google/index', 'google'],
  ['components/hue/Hue/index', 'hue'],
  ['components/material/Material/index', 'material'],
  ['components/photoshop/Photoshop/index', 'photoshop'],
  ['components/sketch/Sketch/index', 'sketch'],
  ['components/slider/Slider/index', 'slider'],
  ['components/swatches/Swatches/index', 'swatches'],
  ['components/twitter/Twitter/index', 'twitter'],
]);

const commonCssEntries = ['alpha', 'checkboard', 'editable-input', 'hue', 'raised', 'saturation', 'swatch'];

function getRelativeStyleImport(fileName, cssPath) {
  const relativePath = path.posix.relative(path.posix.dirname(fileName), cssPath);
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function getStylePrelude(targetDir, fileName, cssEntry) {
  const cssPaths = [
    ...commonCssEntries.map((commonEntry) => `styles/common/${commonEntry}.css`),
    `styles/pickers/${cssEntry}.css`,
  ];

  if (targetDir === 'es') {
    return `${cssPaths.map((cssPath) => `import '${getRelativeStyleImport(fileName, cssPath)}';`).join('\n')}\n`;
  }

  throw new Error(`Unsupported target directory: ${targetDir}`);
}

async function prependStylePrelude(targetDir, fileName, cssEntry) {
  const outputPath = path.join(repoRoot, targetDir, `${fileName}.js`);
  const source = await readFile(outputPath, 'utf8');
  const prelude = getStylePrelude(targetDir, fileName, cssEntry);

  if (source.startsWith(prelude)) {
    return;
  }

  await writeFile(outputPath, `${prelude}${source}`);
}

async function main() {
  const targetDir = process.argv[2];

  if (targetDir !== 'es') {
    throw new Error('Usage: node scripts/attach-picker-style-imports.mjs <es>');
  }

  await Promise.all(
    [...pickerFiles.entries()].map(([fileName, cssEntry]) => prependStylePrelude(targetDir, fileName, cssEntry)),
  );

  console.log(`Attached picker style side effects to ${pickerFiles.size} ${targetDir} entrypoints.`);
}

await main();
