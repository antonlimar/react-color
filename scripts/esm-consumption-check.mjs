import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdtemp, mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const stylesSourceRoot = path.join(repoRoot, 'src', 'styles');
const componentsSourceRoot = path.join(repoRoot, 'src', 'components');

async function collectExpectedStyleArtifacts(sourceRoot, outputRoot, directory = sourceRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const stylePaths = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      stylePaths.push(...(await collectExpectedStyleArtifacts(sourceRoot, outputRoot, absolutePath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.scss') && !entry.name.startsWith('_')) {
      stylePaths.push(path.join(outputRoot, path.relative(sourceRoot, absolutePath).replace(/\.scss$/u, '.css')));
    }
  }

  return stylePaths.sort();
}

async function ensureBuildArtifacts() {
  await access(path.join(repoRoot, 'es', 'index.js'), constants.R_OK);
  const expectedCssArtifacts = [
    ...(await collectExpectedStyleArtifacts(stylesSourceRoot, 'styles')),
    ...(await collectExpectedStyleArtifacts(componentsSourceRoot, 'components')),
  ];

  for (const relativeCssPath of expectedCssArtifacts) {
    await access(path.join(repoRoot, 'es', relativeCssPath), constants.R_OK);
  }

  const [esChromeEntry, esAlphaPointerEntry, esEditableInputEntry, esIndexEntry] = await Promise.all([
    readFile(path.join(repoRoot, 'es', 'components', 'chrome', 'Chrome', 'Chrome.js'), 'utf8'),
    readFile(path.join(repoRoot, 'es', 'components', 'alpha', 'AlphaPointer', 'AlphaPointer.js'), 'utf8'),
    readFile(path.join(repoRoot, 'es', 'components', 'common', 'EditableInput', 'EditableInput.js'), 'utf8'),
    readFile(path.join(repoRoot, 'es', 'index.js'), 'utf8'),
  ]);

  assert.match(
    esChromeEntry,
    /import '\.\/Chrome\.css';/u,
    'es/components/chrome/Chrome/Chrome.js is missing the local CSS side effect.',
  );
  assert.match(
    esAlphaPointerEntry,
    /import '\.\/AlphaPointer\.css';/u,
    'es/components/alpha/AlphaPointer/AlphaPointer.js is missing the local CSS side effect.',
  );
  assert.match(
    esEditableInputEntry,
    /import '\.\/EditableInput\.css';/u,
    'es/components/common/EditableInput/EditableInput.js is missing the local CSS side effect.',
  );
  assert.doesNotMatch(esChromeEntry, /\.scss/u, 'Generated JS should not reference SCSS files.');
  assert.doesNotMatch(esAlphaPointerEntry, /\.scss/u, 'Generated JS should not reference SCSS files.');
  assert.match(
    esIndexEntry,
    /from '\.\/components\/chrome\/index\.js';/u,
    'es/index.js is not re-exporting picker components with Node-compatible ESM specifiers.',
  );
}

function runNode(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      resolve({
        code: code ?? -1,
        stdout,
        stderr,
      });
    });
  });
}

async function createConsumerWorkspace() {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'react-color-consumption-'));
  const nodeModulesDir = path.join(workspace, 'node_modules');

  await mkdir(nodeModulesDir, { recursive: true });
  await symlink(repoRoot, path.join(nodeModulesDir, 'react-color'), 'dir');

  return workspace;
}

async function writeFixture(workspace, relativePath, contents) {
  const fixturePath = path.join(workspace, relativePath);
  await mkdir(path.dirname(fixturePath), { recursive: true });
  await writeFile(fixturePath, contents);
}

async function runBundlerFixture(workspace) {
  const bundlerRoot = path.join(workspace, 'bundler');

  await writeFixture(
    bundlerRoot,
    'index.html',
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>react-color consumption check</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
`,
  );

  await writeFixture(
    bundlerRoot,
    'main.ts',
    `import ReactColorDefault, { EditableInput, HuePicker } from 'react-color';

const consumedEntries = [ReactColorDefault, EditableInput, HuePicker];

if (consumedEntries.some((entry) => typeof entry !== 'function')) {
  throw new Error('Bundler consumption smoke imported a non-component export shape.');
}

document.body.dataset.reactColorConsumptionCheck = String(consumedEntries.length);
`,
  );

  await build({
    configFile: false,
    logLevel: 'silent',
    resolve: {
      preserveSymlinks: true,
    },
    root: bundlerRoot,
    build: {
      emptyOutDir: true,
      outDir: 'dist',
    },
  });

  const assetDir = path.join(bundlerRoot, 'dist', 'assets');
  const assetNames = await readdir(assetDir);
  const cssAssetName = assetNames.find((assetName) => assetName.endsWith('.css'));

  assert.ok(cssAssetName, 'Bundler output did not emit any CSS asset.');

  const bundleCss = await readFile(path.join(assetDir, cssAssetName), 'utf8');

  assert.ok(bundleCss.length > 0, 'Bundler emitted an empty CSS asset.');
  assert.match(bundleCss, /\.rc-chrome/u, 'Bundler CSS is missing styles for an imported picker.');
  assert.match(bundleCss, /\.rc-hue/u, 'Bundler CSS is missing styles for an imported picker.');
  assert.doesNotMatch(bundleCss, /\.rc-sketch__/u, 'Bundler CSS unexpectedly includes an unused picker.');
  assert.doesNotMatch(bundleCss, /\.rc-material__/u, 'Bundler CSS unexpectedly includes an unused picker.');
}

async function main() {
  await ensureBuildArtifacts();

  const workspace = await createConsumerWorkspace();

  try {
    await writeFixture(
      workspace,
      'resolve-node-esm.mjs',
      `import assert from 'node:assert/strict';

assert.match(import.meta.resolve('react-color'), /\\/es\\/index\\.js$/);
assert.match(import.meta.resolve('react-color/es/components/common'), /\\/es\\/components\\/common\\/index\\.js$/);
`,
    );

    await writeFixture(
      workspace,
      'consumer.cjs',
      `const reactColor = require('react-color');
void reactColor;
`,
    );

    const nodeEsmResolveResult = await runNode(['resolve-node-esm.mjs'], workspace);
    assert.equal(
      nodeEsmResolveResult.code,
      0,
      `Native Node ESM export map resolution failed:\n${nodeEsmResolveResult.stderr}`,
    );

    const cjsResult = await runNode(['consumer.cjs'], workspace);
    assert.notEqual(cjsResult.code, 0, 'CommonJS require() unexpectedly consumed the ESM-only package.');
    assert.match(
      cjsResult.stderr,
      /ERR_REQUIRE_ESM|require\(\) of ES Module|ERR_UNKNOWN_FILE_EXTENSION/u,
      `Unexpected CommonJS require() failure:\n${cjsResult.stderr}`,
    );

    await runBundlerFixture(workspace);

    console.log(
      [
        'esm-consumption-check passed:',
        '- Native Node ESM resolved the root entry and documented common component entry through the exports map.',
        '- CommonJS require() no longer consumes the package root.',
        '- The published package layout exposes granular CSS entrypoints for built styles in es/styles and component-local CSS in es/components.',
        '- Picker and common component modules pull in their own published CSS side effects for bundlers.',
        '- Vite consumed root default/named imports without bundling unused picker CSS.',
      ].join('\n'),
    );
  } finally {
    await rm(workspace, { force: true, recursive: true });
  }
}

await main();
