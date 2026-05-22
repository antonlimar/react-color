import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ScriptTarget,
  SyntaxKind,
  createSourceFile,
  isArrayLiteralExpression,
  isAsExpression,
  isIdentifier,
  isNoSubstitutionTemplateLiteral,
  isNumericLiteral,
  isObjectLiteralExpression,
  isParenthesizedExpression,
  isPropertyAssignment,
  isSatisfiesExpression,
  isStringLiteral,
  isVariableStatement,
} from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(repoRoot, 'package.json');
const readmePath = path.join(repoRoot, 'README.md');
const siteContentPath = path.join(repoRoot, 'site', 'src', 'content', 'siteContent.ts');
const defaultOutDir = path.join(repoRoot, 'site', 'dist');

function readSourceFile(filePath) {
  return createSourceFile(filePath, fs.readFileSync(filePath, 'utf8'), ScriptTarget.Latest, true);
}

function unwrapExpression(node) {
  if (isAsExpression(node) || isSatisfiesExpression(node) || isParenthesizedExpression(node)) {
    return unwrapExpression(node.expression);
  }

  return node;
}

function getPropertyNameText(name) {
  if (isIdentifier(name) || isStringLiteral(name) || isNumericLiteral(name)) {
    return name.text;
  }

  throw new Error(`Unsupported object property name in ${siteContentPath}: ${name.getText()}`);
}

function literalToValue(node) {
  const expression = unwrapExpression(node);

  if (isStringLiteral(expression) || isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }

  if (isNumericLiteral(expression)) {
    return Number(expression.text);
  }

  if (expression.kind === SyntaxKind.TrueKeyword) {
    return true;
  }

  if (expression.kind === SyntaxKind.FalseKeyword) {
    return false;
  }

  if (isArrayLiteralExpression(expression)) {
    return expression.elements.map((element) => literalToValue(element));
  }

  if (isObjectLiteralExpression(expression)) {
    return Object.fromEntries(
      expression.properties.map((property) => {
        if (!isPropertyAssignment(property)) {
          throw new Error(`Unsupported object property in ${siteContentPath}: ${property.getText()}`);
        }

        return [getPropertyNameText(property.name), literalToValue(property.initializer)];
      }),
    );
  }

  throw new Error(`Unsupported literal in ${siteContentPath}: ${expression.getText()}`);
}

function getExportedConstArray(sourceFile, exportName) {
  for (const statement of sourceFile.statements) {
    if (!isVariableStatement(statement)) {
      continue;
    }

    const isExported = statement.modifiers?.some((modifier) => modifier.kind === SyntaxKind.ExportKeyword) ?? false;

    if (!isExported) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!isIdentifier(declaration.name) || declaration.name.text !== exportName || !declaration.initializer) {
        continue;
      }

      const value = literalToValue(declaration.initializer);

      if (!Array.isArray(value)) {
        throw new Error(`Expected ${exportName} to be an array.`);
      }

      return value;
    }
  }

  throw new Error(`Could not find exported const ${exportName}.`);
}

function createHomepageUrl(packageJson) {
  const homepage = packageJson.homepage;

  if (!homepage) {
    throw new Error('Expected package.json homepage for LLM documentation URLs.');
  }

  return homepage.endsWith('/') ? homepage : `${homepage}/`;
}

function createAbsoluteUrl(homepageUrl, relativePath = '') {
  return new URL(relativePath, homepageUrl).toString();
}

function normalizeMarkdown(value) {
  return value.replace(/\r\n/g, '\n').trim();
}

function renderBlocks(blocks = []) {
  return blocks
    .flatMap((block) => {
      if (block.type === 'text') {
        return [block.text];
      }

      if (block.type === 'bullets') {
        return [block.items.map((item) => `- ${item}`).join('\n')];
      }

      if (block.type === 'code') {
        const label = block.label ? [`**${block.label}**`] : [];
        return [...label, `\`\`\`${block.language}\n${block.code.trimEnd()}\n\`\`\``];
      }

      if (block.type === 'package-manager') {
        const commands = Object.entries(block.commands)
          .map(([manager, command]) => `${manager}: \`${command}\``)
          .join('\n');
        return [block.label ? `**${block.label}**\n\n${commands}` : commands];
      }

      return [];
    })
    .join('\n\n');
}

function renderPropertyGroups(subsection) {
  return (subsection.propertyGroups ?? [])
    .map((group) => {
      const heading = `### ${group.title}`;
      const summary = group.summary ? `\n\n${group.summary}` : '';
      const properties = group.properties
        .map((property) => {
          const defaultValue = property.defaultValue ? ` Default: \`${property.defaultValue}\`.` : '';
          return `- \`${property.name}\` (${property.type}): ${property.description}${defaultValue}`;
        })
        .join('\n');

      return `${heading}${summary}\n\n${properties}`;
    })
    .join('\n\n');
}

function renderSiteSections(siteSections) {
  return siteSections
    .map((section) => {
      const parts = [`## ${section.title}`];

      if (section.intro) {
        parts.push(section.intro);
      }

      const sectionBlocks = renderBlocks(section.blocks);

      if (sectionBlocks) {
        parts.push(sectionBlocks);
      }

      section.subsections?.forEach((subsection) => {
        parts.push(`### ${subsection.title}`);

        if (subsection.intro) {
          parts.push(subsection.intro);
        }

        const subsectionBlocks = renderBlocks(subsection.blocks);

        if (subsectionBlocks) {
          parts.push(subsectionBlocks);
        }

        const propertyGroups = renderPropertyGroups(subsection);

        if (propertyGroups) {
          parts.push(propertyGroups);
        }
      });

      return parts.join('\n\n');
    })
    .join('\n\n');
}

function renderPickerReference(pickerMetadata, homepageUrl) {
  return pickerMetadata
    .map((picker) => {
      const docsUrl = createAbsoluteUrl(homepageUrl, `#${picker.apiAnchor}`);
      return `- ${picker.exportName}: ${picker.summary} Docs: ${docsUrl}`;
    })
    .join('\n');
}

function renderLlmsTxt({ packageJson, pickerMetadata, homepageUrl }) {
  const packageName = packageJson.name;
  const pickerLinks = pickerMetadata
    .map(
      (picker) =>
        `- [${picker.exportName}](${createAbsoluteUrl(homepageUrl, `#${picker.apiAnchor}`)}): ${picker.summary}`,
    )
    .join('\n');

  return `${[
    `# ${packageName}`,
    packageJson.description,
    'A maintained modernization fork of react-color with named picker exports, TypeScript typings, generated CSS entrypoints, and a Vite documentation site.',
    'Prefer named imports from the package root. Default imports are legacy compatibility and should not be promoted in new examples.',
    '## Canonical Usage',
    "```tsx\nimport { ChromePicker, SketchPicker } from '@antonlimar/react-color';\n```",
    '## Documentation',
    `- [Documentation home](${createAbsoluteUrl(homepageUrl)})`,
    `- [Picker gallery](${createAbsoluteUrl(homepageUrl, 'gallery/')})`,
    `- [Full LLM documentation](${createAbsoluteUrl(homepageUrl, 'llms-full.txt')})`,
    `- [Repository](https://github.com/antonlimar/react-color)`,
    `- [npm package](https://www.npmjs.com/package/${encodeURIComponent(packageName)})`,
    '## Picker Exports',
    pickerLinks,
  ].join('\n\n')}\n`;
}

function renderLlmsFullTxt({ packageJson, readme, pickerMetadata, siteSections, homepageUrl }) {
  const packageName = packageJson.name;
  const namedPickerExports = pickerMetadata.map((picker) => picker.exportName).join(', ');

  return `${[
    `# ${packageName} Full Documentation`,
    packageJson.description,
    `Canonical site: ${createAbsoluteUrl(homepageUrl)}`,
    `Repository: https://github.com/antonlimar/react-color`,
    `npm: https://www.npmjs.com/package/${encodeURIComponent(packageName)}`,
    '## LLM Guidance',
    [
      '- This package is a maintained modernization fork of react-color.',
      '- Prefer named imports from the package root in new examples.',
      '- Do not promote default imports except as legacy compatibility.',
      '- Root picker imports include the CSS needed by the picker modules.',
      '- Public picker behavior, types, and packaging contracts should be treated as compatibility-sensitive.',
      `- Named picker exports: ${namedPickerExports}.`,
    ].join('\n'),
    '## Quick Usage',
    '```tsx\nimport { SketchPicker } from \'@antonlimar/react-color\';\n\nexport function Example() {\n  return <SketchPicker theme="auto" />;\n}\n```',
    '## Picker Reference',
    renderPickerReference(pickerMetadata, homepageUrl),
    '## Documentation Site Content',
    renderSiteSections(siteSections),
    '## README',
    normalizeMarkdown(readme),
  ].join('\n\n')}\n`;
}

export function generateLlmsDocs({ outDir = defaultOutDir } = {}) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const readme = fs.readFileSync(readmePath, 'utf8');
  const siteContentSource = readSourceFile(siteContentPath);
  const pickerMetadata = getExportedConstArray(siteContentSource, 'pickerMetadata');
  const siteSections = getExportedConstArray(siteContentSource, 'siteSections');
  const homepageUrl = createHomepageUrl(packageJson);
  const llmsTxt = renderLlmsTxt({ packageJson, pickerMetadata, homepageUrl });
  const llmsFullTxt = renderLlmsFullTxt({ packageJson, readme, pickerMetadata, siteSections, homepageUrl });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'llms.txt'), llmsTxt);
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), llmsFullTxt);

  return {
    files: [path.join(outDir, 'llms.txt'), path.join(outDir, 'llms-full.txt')],
  };
}

if (process.argv[1] === __filename) {
  const outDirFlagIndex = process.argv.indexOf('--out-dir');
  const outDir = outDirFlagIndex === -1 ? defaultOutDir : path.resolve(process.argv[outDirFlagIndex + 1]);
  const { files } = generateLlmsDocs({ outDir });

  console.log(`Generated LLM documentation files:\n${files.map((filePath) => `- ${filePath}`).join('\n')}`);
}
