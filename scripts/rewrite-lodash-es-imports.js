const fs = require('fs');
const path = require('path');

const outputDir = process.argv[2];

if (!outputDir) {
  throw new Error('Expected output directory argument, for example: node scripts/rewrite-lodash-es-imports.js es');
}

const rootDir = path.resolve(__dirname, '..', outputDir);
const lodashImportPattern = /(['"])lodash\//g;

function rewriteFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const rewritten = source.replace(lodashImportPattern, '$1lodash-es/');

  if (rewritten !== source) {
    fs.writeFileSync(filePath, rewritten);
  }
}

function visit(targetPath) {
  const stat = fs.statSync(targetPath);

  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath)) {
      visit(path.join(targetPath, entry));
    }
    return;
  }

  if (targetPath.endsWith('.js')) {
    rewriteFile(targetPath);
  }
}

visit(rootDir);
