import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const artifactPaths = ['lib', 'es', 'docs/build', 'package-lock.json'];
const regenerationSteps = [
  ['npm', ['run', 'build']],
  ['npm', ['run', 'build-storybook']],
  ['npm', ['run', 'docs-dist']],
];

async function pathExists(targetPath) {
  try {
    await readdir(targetPath);
    return 'directory';
  } catch (error) {
    if (error && error.code !== 'ENOTDIR' && error.code !== 'ENOENT') {
      throw error;
    }
  }

  try {
    await readFile(targetPath);
    return 'file';
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return 'missing';
    }

    throw error;
  }
}

async function hashFile(filePath) {
  const content = await readFile(filePath);
  return createHash('sha256').update(content).digest('hex');
}

async function collectDirectoryEntries(rootDir, currentDir = rootDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const results = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, fullPath).split(path.sep).join('/');

    if (entry.isDirectory()) {
      results.push(`dir:${relativePath}`);
      results.push(...(await collectDirectoryEntries(rootDir, fullPath)));
      continue;
    }

    if (entry.isFile()) {
      results.push(`file:${relativePath}:${await hashFile(fullPath)}`);
    }
  }

  return results;
}

async function snapshotPath(targetPath) {
  const kind = await pathExists(targetPath);

  if (kind === 'missing') {
    return 'missing';
  }

  if (kind === 'file') {
    return `file:${await hashFile(targetPath)}`;
  }

  const lines = await collectDirectoryEntries(targetPath);
  return createHash('sha256').update(lines.join('\n')).digest('hex');
}

async function createSnapshot() {
  const snapshot = {};

  for (const targetPath of artifactPaths) {
    snapshot[targetPath] = await snapshotPath(targetPath);
  }

  return snapshot;
}

function diffSnapshots(before, after) {
  return artifactPaths.filter((targetPath) => before[targetPath] !== after[targetPath]);
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command} ${args.join(' ')} (${code ?? 'unknown'})`));
    });
  });
}

const before = await createSnapshot();

for (const [command, args] of regenerationSteps) {
  await runCommand(command, args);
}

const after = await createSnapshot();
const changedPaths = diffSnapshots(before, after);

if (changedPaths.length > 0) {
  console.error('Generated artifacts are out of sync after regeneration:');
  for (const changedPath of changedPaths) {
    console.error(`- ${changedPath}`);
  }
  process.exit(1);
}

console.log('Generated artifacts are in sync.');
