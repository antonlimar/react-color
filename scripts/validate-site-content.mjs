import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const siteContentPath = path.join(repoRoot, 'site', 'src', 'content', 'siteContent.ts');
const publicApiPath = path.join(repoRoot, 'src', 'index.ts');

function readSourceFile(filePath) {
  return ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf8'), ts.ScriptTarget.Latest, true);
}

function unwrapExpression(node) {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) {
    return unwrapExpression(node.expression);
  }

  return node;
}

function getPropertyNameText(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  throw new Error(`Unsupported object property name in ${siteContentPath}: ${name.getText()}`);
}

function literalToValue(node) {
  const expression = unwrapExpression(node);

  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }

  if (ts.isNumericLiteral(expression)) {
    return Number(expression.text);
  }

  if (expression.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (expression.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (ts.isArrayLiteralExpression(expression)) {
    return expression.elements.map((element) => literalToValue(element));
  }

  if (ts.isObjectLiteralExpression(expression)) {
    return Object.fromEntries(
      expression.properties.map((property) => {
        if (!ts.isPropertyAssignment(property)) {
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
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;

    if (!isExported) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== exportName || !declaration.initializer) {
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

function createPropertyGroupAnchorId(subsection, group) {
  return `${subsection.id}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function createAnchorSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createPropertyAnchorId(subsection, group, property) {
  return `${createPropertyGroupAnchorId(subsection, group)}-${createAnchorSlug(property.name)}`;
}

function addAnchor(anchorMap, id, source) {
  if (!id) {
    return;
  }

  const sources = anchorMap.get(id) ?? [];
  sources.push(source);
  anchorMap.set(id, sources);
}

function collectContentAnchors(siteSections) {
  const anchorMap = new Map();

  addAnchor(anchorMap, 'site-documentation', 'App skip-link target');

  siteSections.forEach((section) => {
    addAnchor(anchorMap, section.id, `section "${section.title}"`);

    section.subsections?.forEach((subsection) => {
      addAnchor(anchorMap, subsection.id, `subsection "${subsection.title}"`);

      if (subsection.id !== 'picker-specific-props') {
        return;
      }

      subsection.propertyGroups?.forEach((group) => {
        const groupAnchorId = createPropertyGroupAnchorId(subsection, group);
        addAnchor(anchorMap, groupAnchorId, `property group "${group.title}"`);

        group.properties.forEach((property) => {
          addAnchor(
            anchorMap,
            createPropertyAnchorId(subsection, group, property),
            `property "${group.title}.${property.name}"`,
          );
        });
      });
    });
  });

  return anchorMap;
}

function getPublicPickerExports(sourceFile) {
  const pickerExports = new Set();

  sourceFile.statements.forEach((statement) => {
    if (
      !ts.isExportDeclaration(statement) ||
      !statement.moduleSpecifier ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      return;
    }

    const modulePath = statement.moduleSpecifier.text;

    if (
      !/^\.\/components\/(?!common(?:\/|$))[a-z]+(?:\/[A-Z][A-Za-z]*)?$/.test(modulePath) ||
      !statement.exportClause
    ) {
      return;
    }

    statement.exportClause.elements.forEach((element) => {
      const exportName = element.name.text;

      if (exportName.endsWith('Picker')) {
        pickerExports.add(exportName);
      }
    });
  });

  return [...pickerExports].sort((left, right) => left.localeCompare(right));
}

function collectInlineTextValues(siteSections) {
  const values = [];

  function addText(value, source) {
    if (value) {
      values.push({ value, source });
    }
  }

  siteSections.forEach((section) => {
    addText(section.intro, `section "${section.title}" intro`);

    section.blocks.forEach((block, blockIndex) => {
      if (block.type === 'text') {
        addText(block.text, `section "${section.title}" text block ${blockIndex + 1}`);
      }

      if (block.type === 'bullets') {
        block.items.forEach((item, itemIndex) => addText(item, `section "${section.title}" bullet ${itemIndex + 1}`));
      }
    });

    section.subsections?.forEach((subsection) => {
      addText(subsection.intro, `subsection "${subsection.title}" intro`);

      subsection.blocks?.forEach((block, blockIndex) => {
        if (block.type === 'text') {
          addText(block.text, `subsection "${subsection.title}" text block ${blockIndex + 1}`);
        }

        if (block.type === 'bullets') {
          block.items.forEach((item, itemIndex) =>
            addText(item, `subsection "${subsection.title}" bullet ${itemIndex + 1}`),
          );
        }
      });

      subsection.propertyGroups?.forEach((group) => {
        addText(group.summary, `property group "${group.title}" summary`);
        group.properties.forEach((property) => {
          addText(property.description, `property "${group.title}.${property.name}" description`);
        });
      });
    });
  });

  return values;
}

function collectInternalLinks(siteSections, pickerMetadata) {
  const links = [
    { anchor: 'site-documentation', source: 'App skip link' },
    { anchor: 'about', source: 'App hero docs link' },
    ...pickerMetadata.map((picker) => ({
      anchor: picker.apiAnchor,
      source: `gallery API link for ${picker.exportName}`,
    })),
  ];

  collectInlineTextValues(siteSections).forEach(({ value, source }) => {
    const markdownLinkPattern = /\[[^\]]+\]\(#([^)]+)\)/g;
    let match = markdownLinkPattern.exec(value);

    while (match) {
      links.push({ anchor: decodeURIComponent(match[1]), source });
      match = markdownLinkPattern.exec(value);
    }
  });

  return links;
}

function formatList(values) {
  return values.map((value) => `  - ${value}`).join('\n');
}

const siteContentSource = readSourceFile(siteContentPath);
const publicApiSource = readSourceFile(publicApiPath);
const pickerMetadata = getExportedConstArray(siteContentSource, 'pickerMetadata');
const siteSections = getExportedConstArray(siteContentSource, 'siteSections');
const anchorMap = collectContentAnchors(siteSections);
const anchors = new Set(anchorMap.keys());
const failures = [];

const duplicateAnchors = [...anchorMap.entries()]
  .filter(([, sources]) => sources.length > 1)
  .map(([anchor, sources]) => `${anchor}\n${sources.map((source) => `    from ${source}`).join('\n')}`);

if (duplicateAnchors.length > 0) {
  failures.push(`Duplicate generated site anchors:\n${formatList(duplicateAnchors)}`);
}

const missingGalleryAnchors = pickerMetadata
  .filter((picker) => !anchors.has(picker.apiAnchor))
  .map((picker) => `${picker.exportName} -> #${picker.apiAnchor}`);

if (missingGalleryAnchors.length > 0) {
  failures.push(`Gallery apiAnchor values without matching anchors:\n${formatList(missingGalleryAnchors)}`);
}

const publicPickerExports = getPublicPickerExports(publicApiSource);
const galleryPickerExports = [...new Set(pickerMetadata.map((picker) => picker.exportName))].sort((left, right) =>
  left.localeCompare(right),
);
const missingGalleryPickers = publicPickerExports.filter((exportName) => !galleryPickerExports.includes(exportName));
const extraGalleryPickers = galleryPickerExports.filter((exportName) => !publicPickerExports.includes(exportName));

if (missingGalleryPickers.length > 0) {
  failures.push(`Public picker exports missing from gallery:\n${formatList(missingGalleryPickers)}`);
}

if (extraGalleryPickers.length > 0) {
  failures.push(`Gallery picker exports missing from public API:\n${formatList(extraGalleryPickers)}`);
}

const invalidInternalLinks = collectInternalLinks(siteSections, pickerMetadata)
  .filter(({ anchor }) => !anchors.has(anchor))
  .map(({ anchor, source }) => `${source} -> #${anchor}`);

if (invalidInternalLinks.length > 0) {
  failures.push(`Internal site links without matching anchors:\n${formatList(invalidInternalLinks)}`);
}

if (failures.length > 0) {
  throw new Error(`Site content validation failed:\n\n${failures.join('\n\n')}`);
}

console.log(
  `Validated site content: ${anchors.size} anchors, ${pickerMetadata.length} gallery pickers, ${publicPickerExports.length} public picker exports.`,
);
