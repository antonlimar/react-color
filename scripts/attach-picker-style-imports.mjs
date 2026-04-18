import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const pickerFiles = new Map([
  ['Alpha', 'alpha'],
  ['Block', 'block'],
  ['Circle', 'circle'],
  ['Chrome', 'chrome'],
  ['Compact', 'compact'],
  ['Github', 'github'],
  ['Google', 'google'],
  ['Hue', 'hue'],
  ['Material', 'material'],
  ['Photoshop', 'photoshop'],
  ['Sketch', 'sketch'],
  ['Slider', 'slider'],
  ['Swatches', 'swatches'],
  ['Twitter', 'twitter'],
]);

const commonCssEntries = ['alpha', 'checkboard', 'editable-input', 'hue', 'raised', 'saturation', 'swatch'];

function getStylePrelude(targetDir, cssEntry) {
  const cssPaths = [
    ...commonCssEntries.map((commonEntry) => `./styles/common/${commonEntry}.css`),
    `./styles/pickers/${cssEntry}.css`,
  ];

  if (targetDir === 'es') {
    return `${cssPaths.map((cssPath) => `import '${cssPath}';`).join('\n')}\n`;
  }

  throw new Error(`Unsupported target directory: ${targetDir}`);
}

async function prependStylePrelude(targetDir, fileName, cssEntry) {
  const outputPath = path.join(repoRoot, targetDir, `${fileName}.js`);
  const source = await readFile(outputPath, 'utf8');
  const prelude = getStylePrelude(targetDir, cssEntry);

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
