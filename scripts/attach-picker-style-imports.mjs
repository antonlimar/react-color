import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const styleEntries = new Map([
  ['components/common/Alpha/index', ['common/checkboard', 'common/alpha']],
  ['components/common/Alpha/Alpha', ['common/checkboard', 'common/alpha']],
  ['components/common/Checkboard/index', ['common/checkboard']],
  ['components/common/Checkboard/Checkboard', ['common/checkboard']],
  ['components/common/EditableInput/index', ['common/editable-input']],
  ['components/common/EditableInput/EditableInput', ['common/editable-input']],
  ['components/common/Hue/index', ['common/hue']],
  ['components/common/Hue/Hue', ['common/hue']],
  ['components/common/Raised/index', ['common/raised']],
  ['components/common/Raised/Raised', ['common/raised']],
  ['components/common/Saturation/index', ['common/saturation']],
  ['components/common/Saturation/Saturation', ['common/saturation']],
  ['components/common/Swatch/index', ['common/checkboard', 'common/swatch']],
  ['components/common/Swatch/Swatch', ['common/checkboard', 'common/swatch']],
  ['components/alpha/index', ['common/checkboard', 'common/alpha', 'pickers/alpha']],
  ['components/alpha/Alpha/index', ['common/checkboard', 'common/alpha', 'pickers/alpha']],
  ['components/alpha/Alpha/Alpha', ['common/checkboard', 'common/alpha', 'pickers/alpha']],
  ['components/block/index', ['common/checkboard', 'common/editable-input', 'common/swatch', 'pickers/block']],
  ['components/block/Block/index', ['common/checkboard', 'common/editable-input', 'common/swatch', 'pickers/block']],
  ['components/block/Block/Block', ['common/checkboard', 'common/editable-input', 'common/swatch', 'pickers/block']],
  ['components/circle/index', ['common/checkboard', 'common/swatch', 'pickers/circle']],
  ['components/circle/Circle/index', ['common/checkboard', 'common/swatch', 'pickers/circle']],
  ['components/circle/Circle/Circle', ['common/checkboard', 'common/swatch', 'pickers/circle']],
  [
    'components/chrome/index',
    ['common/checkboard', 'common/editable-input', 'common/hue', 'common/saturation', 'common/alpha', 'pickers/chrome'],
  ],
  [
    'components/chrome/Chrome/index',
    ['common/checkboard', 'common/editable-input', 'common/hue', 'common/saturation', 'common/alpha', 'pickers/chrome'],
  ],
  [
    'components/chrome/Chrome/Chrome',
    ['common/checkboard', 'common/editable-input', 'common/hue', 'common/saturation', 'common/alpha', 'pickers/chrome'],
  ],
  [
    'components/compact/index',
    ['common/checkboard', 'common/editable-input', 'common/raised', 'common/swatch', 'pickers/compact'],
  ],
  [
    'components/compact/Compact/index',
    ['common/checkboard', 'common/editable-input', 'common/raised', 'common/swatch', 'pickers/compact'],
  ],
  [
    'components/compact/Compact/Compact',
    ['common/checkboard', 'common/editable-input', 'common/raised', 'common/swatch', 'pickers/compact'],
  ],
  ['components/github/index', ['common/checkboard', 'common/swatch', 'pickers/github']],
  ['components/github/Github/index', ['common/checkboard', 'common/swatch', 'pickers/github']],
  ['components/github/Github/Github', ['common/checkboard', 'common/swatch', 'pickers/github']],
  ['components/google/index', ['common/editable-input', 'common/hue', 'common/saturation', 'pickers/google']],
  ['components/google/Google/index', ['common/editable-input', 'common/hue', 'common/saturation', 'pickers/google']],
  ['components/google/Google/Google', ['common/editable-input', 'common/hue', 'common/saturation', 'pickers/google']],
  ['components/hue/index', ['common/hue', 'pickers/hue']],
  ['components/hue/Hue/index', ['common/hue', 'pickers/hue']],
  ['components/hue/Hue/Hue', ['common/hue', 'pickers/hue']],
  ['components/material/index', ['common/editable-input', 'common/raised', 'pickers/material']],
  ['components/material/Material/index', ['common/editable-input', 'common/raised', 'pickers/material']],
  ['components/material/Material/Material', ['common/editable-input', 'common/raised', 'pickers/material']],
  ['components/photoshop/index', ['common/editable-input', 'common/hue', 'common/saturation', 'pickers/photoshop']],
  [
    'components/photoshop/Photoshop/index',
    ['common/editable-input', 'common/hue', 'common/saturation', 'pickers/photoshop'],
  ],
  [
    'components/photoshop/Photoshop/Photoshop',
    ['common/editable-input', 'common/hue', 'common/saturation', 'pickers/photoshop'],
  ],
  [
    'components/sketch/index',
    [
      'common/checkboard',
      'common/editable-input',
      'common/hue',
      'common/saturation',
      'common/alpha',
      'common/swatch',
      'pickers/sketch',
    ],
  ],
  [
    'components/sketch/Sketch/index',
    [
      'common/checkboard',
      'common/editable-input',
      'common/hue',
      'common/saturation',
      'common/alpha',
      'common/swatch',
      'pickers/sketch',
    ],
  ],
  [
    'components/sketch/Sketch/Sketch',
    [
      'common/checkboard',
      'common/editable-input',
      'common/hue',
      'common/saturation',
      'common/alpha',
      'common/swatch',
      'pickers/sketch',
    ],
  ],
  ['components/slider/index', ['common/hue', 'pickers/slider']],
  ['components/slider/Slider/index', ['common/hue', 'pickers/slider']],
  ['components/slider/Slider/Slider', ['common/hue', 'pickers/slider']],
  ['components/swatches/index', ['common/checkboard', 'common/raised', 'common/swatch', 'pickers/swatches']],
  ['components/swatches/Swatches/index', ['common/checkboard', 'common/raised', 'common/swatch', 'pickers/swatches']],
  [
    'components/swatches/Swatches/Swatches',
    ['common/checkboard', 'common/raised', 'common/swatch', 'pickers/swatches'],
  ],
  ['components/twitter/index', ['common/checkboard', 'common/editable-input', 'common/swatch', 'pickers/twitter']],
  [
    'components/twitter/Twitter/index',
    ['common/checkboard', 'common/editable-input', 'common/swatch', 'pickers/twitter'],
  ],
  [
    'components/twitter/Twitter/Twitter',
    ['common/checkboard', 'common/editable-input', 'common/swatch', 'pickers/twitter'],
  ],
]);

function getRelativeStyleImport(fileName, cssPath) {
  const relativePath = path.posix.relative(path.posix.dirname(fileName), cssPath);
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function getStylePrelude(targetDir, fileName, cssEntries) {
  const cssPaths = cssEntries.map((cssEntry) => `styles/${cssEntry}.css`);

  if (targetDir === 'es') {
    return `${cssPaths.map((cssPath) => `import '${getRelativeStyleImport(fileName, cssPath)}';`).join('\n')}\n`;
  }

  throw new Error(`Unsupported target directory: ${targetDir}`);
}

async function prependStylePrelude(targetDir, fileName, cssEntries) {
  const outputPath = path.join(repoRoot, targetDir, `${fileName}.js`);
  const source = await readFile(outputPath, 'utf8');
  const prelude = getStylePrelude(targetDir, fileName, cssEntries);
  const sourceWithoutScssImports = stripSourceScssImports(source);

  if (sourceWithoutScssImports.startsWith(prelude)) {
    return;
  }

  await writeFile(outputPath, `${prelude}${sourceWithoutScssImports}`);
}

function stripSourceScssImports(source) {
  return source.replace(/^import\s+['"][^'"]+\.scss['"];\r?\n/gmu, '');
}

async function removeDeclarationScssImport(targetDir, fileName) {
  const outputPath = path.join(repoRoot, targetDir, `${fileName}.d.ts`);
  const source = await readFile(outputPath, 'utf8');
  const sourceWithoutScssImports = stripSourceScssImports(source);

  if (source === sourceWithoutScssImports) {
    return;
  }

  await writeFile(outputPath, sourceWithoutScssImports);
}

async function main() {
  const targetDir = process.argv[2];

  if (targetDir !== 'es') {
    throw new Error('Usage: node scripts/attach-picker-style-imports.mjs <es>');
  }

  await Promise.all(
    [...styleEntries.entries()].flatMap(([fileName, cssEntries]) => [
      prependStylePrelude(targetDir, fileName, cssEntries),
      removeDeclarationScssImport(targetDir, fileName),
    ]),
  );

  console.log(`Attached style side effects to ${styleEntries.size} ${targetDir} entrypoints.`);
}

await main();
