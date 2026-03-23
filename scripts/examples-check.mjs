import { spawn } from 'node:child_process';

const exampleDirs = [
  'examples/basic',
  'examples/basic-positioning',
  'examples/basic-toggle-open-closed',
  'examples/basic-with-react-hooks',
  'examples/custom-picker',
  'examples/custom-pointer',
  'examples/with-portals',
  'examples/with-redux',
];

function runExampleBuild(exampleDir) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build', '--prefix', exampleDir], {
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Example build failed for ${exampleDir} with exit code ${code ?? 'unknown'}`));
    });
  });
}

for (const exampleDir of exampleDirs) {
  // Keep output grouped by example so CI failures are easy to spot.
  console.log(`\n==> Building ${exampleDir}`);
  await runExampleBuild(exampleDir);
}
