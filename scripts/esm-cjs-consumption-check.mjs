import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdtemp, mkdir, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const stylesSourceRoot = path.join(repoRoot, 'src', 'styles');

async function collectExpectedStyleArtifacts(directory = stylesSourceRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const stylePaths = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      stylePaths.push(...(await collectExpectedStyleArtifacts(absolutePath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.scss') && !entry.name.startsWith('_')) {
      stylePaths.push(path.relative(stylesSourceRoot, absolutePath).replace(/\.scss$/u, '.css'));
    }
  }

  return stylePaths.sort();
}

async function ensureBuildArtifacts() {
  await access(path.join(repoRoot, 'lib', 'index.js'), constants.R_OK);
  await access(path.join(repoRoot, 'es', 'index.js'), constants.R_OK);
  const expectedCssArtifacts = await collectExpectedStyleArtifacts();

  for (const relativeCssPath of expectedCssArtifacts) {
    await access(path.join(repoRoot, 'lib', 'styles', relativeCssPath), constants.R_OK);
    await access(path.join(repoRoot, 'es', 'styles', relativeCssPath), constants.R_OK);
  }
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
    `import 'react-color/es/styles/index.css';
import 'react-color/lib/styles/index.css';
import 'react-color/es/styles/pickers/chrome.css';
import 'react-color/lib/styles/pickers/sketch.css';
import 'react-color/es/styles/common/editable-input.css';
import 'react-color/lib/styles/common/editable-input.css';
import ReactColorDefault, { SketchPicker } from 'react-color';
import SketchPickerEsm from 'react-color/es/Sketch';
import HuePickerLib from 'react-color/lib/Hue';
import { EditableInput as EditableInputLib } from 'react-color/lib/components/common';

const consumedEntries = [ReactColorDefault, SketchPicker, SketchPickerEsm, HuePickerLib, EditableInputLib];

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
}

async function main() {
  await ensureBuildArtifacts();

  const workspace = await createConsumerWorkspace();

  try {
    await writeFixture(
      workspace,
      'consumer.cjs',
      `const assert = require('node:assert/strict');
const reactColor = require('react-color');
const { SketchPicker } = reactColor;
const HuePickerLib = require('react-color/lib/Hue').default;
const EditableInputLib = require('react-color/lib/components/common').EditableInput;

assert.equal(typeof reactColor.default, 'function');
assert.equal(typeof SketchPicker, 'function');
assert.equal(typeof HuePickerLib, 'function');
assert.equal(typeof EditableInputLib, 'function');
`,
    );

    await writeFixture(
      workspace,
      'consumer-node-esm.mjs',
      `import assert from 'node:assert/strict';
import reactColorCjsNamespace from 'react-color';

assert.equal(typeof reactColorCjsNamespace.default, 'function');
assert.equal(typeof reactColorCjsNamespace.SketchPicker, 'function');
`,
    );

    const cjsResult = await runNode(['consumer.cjs'], workspace);
    assert.equal(cjsResult.code, 0, `CommonJS root/lib consumption failed:\n${cjsResult.stderr}`);

    const nodeEsmResult = await runNode(['consumer-node-esm.mjs'], workspace);
    assert.equal(nodeEsmResult.code, 0, `Native Node ESM root consumption failed:\n${nodeEsmResult.stderr}`);

    const nodeEsmNamedResult = await runNode(
      ['--input-type=module', '-e', `import { SketchPicker } from 'react-color'; void SketchPicker;`],
      workspace,
    );
    assert.notEqual(nodeEsmNamedResult.code, 0, 'Native Node ESM named root import unexpectedly succeeded.');
    assert.match(
      nodeEsmNamedResult.stderr,
      /Named export 'SketchPicker' not found/,
      `Unexpected native Node ESM named-import failure:\n${nodeEsmNamedResult.stderr}`,
    );

    const nodeEsmDeepLibResult = await runNode(
      ['--input-type=module', '-e', `import HuePickerLib from 'react-color/lib/Hue'; void HuePickerLib;`],
      workspace,
    );
    assert.notEqual(nodeEsmDeepLibResult.code, 0, 'Native Node ESM lib deep import unexpectedly succeeded.');
    assert.match(
      nodeEsmDeepLibResult.stderr,
      /ERR_MODULE_NOT_FOUND/,
      `Unexpected native Node ESM lib deep-import failure:\n${nodeEsmDeepLibResult.stderr}`,
    );

    const nodeEsmDeepEsResult = await runNode(
      ['--input-type=module', '-e', `import SketchPickerEsm from 'react-color/es/Sketch'; void SketchPickerEsm;`],
      workspace,
    );
    assert.notEqual(nodeEsmDeepEsResult.code, 0, 'Native Node ESM es deep import unexpectedly succeeded.');
    assert.match(
      nodeEsmDeepEsResult.stderr,
      /ERR_MODULE_NOT_FOUND/,
      `Unexpected native Node ESM es deep-import failure:\n${nodeEsmDeepEsResult.stderr}`,
    );

    await runBundlerFixture(workspace);

    console.log(
      [
        'esm-cjs-consumption-check passed:',
        '- CommonJS require() consumed the root entry and lib/ deep imports.',
        '- The published package layout exposes aggregate and granular CSS entrypoints for every built stylesheet in lib/styles and es/styles.',
        '- Native Node ESM consumed the root CommonJS entry via the default namespace object.',
        '- Native Node ESM still rejects direct named root imports and extensionless lib/es deep imports without an exports map.',
        '- Vite consumed root default/named imports, lib/es deep imports, and aggregate/granular CSS entrypoints through the published package layout.',
      ].join('\n'),
    );
  } finally {
    await rm(workspace, { force: true, recursive: true });
  }
}

await main();
