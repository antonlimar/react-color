import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import {
  Link,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from '@tanstack/react-router';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import { ChromePicker, CompactPicker, GithubPicker, SketchPicker } from 'react-color';
import type { ColorResult, RGBAColor } from 'react-color';
import { pickerMetadata, siteSections } from './content';
import type {
  ApiProperty,
  CodeBlock,
  ContentSection,
  ContentSubsection,
  PackageManager,
  PickerMetadata,
  PropertyGroup,
  SectionBlock,
} from './content';

interface NavSubsection extends ContentSubsection {
  children: Array<{
    id: string;
    title: string;
  }>;
}

type SearchResultKind = 'section' | 'prop' | 'picker' | 'example';

interface SearchIndexEntry {
  id: string;
  anchorId: string;
  title: string;
  kind: SearchResultKind;
  content: string;
}

interface SearchResult extends SearchIndexEntry {
  snippet: string;
}

function escapeHtml(code: string) {
  return code
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const packageManagerStorageKey = 'react-color-docs-package-manager';

const packageManagers: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

const galleryPagePath = '/gallery' as const;

function normalizeRouterBasepath(baseUrl: string) {
  if (!baseUrl || baseUrl === '/') {
    return '/';
  }

  return `/${baseUrl.replace(/^\/+|\/+$/g, '')}`;
}

function isPackageManager(value: string | null): value is PackageManager {
  return packageManagers.includes(value as PackageManager);
}

function getInitialPackageManager(): PackageManager {
  if (typeof window === 'undefined') {
    return 'npm';
  }

  const savedManager = window.localStorage.getItem(packageManagerStorageKey);

  return isPackageManager(savedManager) ? savedManager : 'npm';
}

function highlightCode(code: string, language: CodeBlock['language']) {
  const prismLanguage =
    language === 'tsx'
      ? Prism.languages.tsx
      : language === 'ts'
        ? Prism.languages.typescript
        : language === 'jsx'
          ? Prism.languages.jsx
          : language === 'js'
            ? Prism.languages.javascript
            : language === 'css'
              ? Prism.languages.css
              : language === 'bash'
                ? Prism.languages.bash
                : undefined;

  if (!prismLanguage) {
    return escapeHtml(code);
  }

  return Prism.highlight(code, prismLanguage, language);
}

function copyWithTextareaFallback(value: string) {
  if (typeof document === 'undefined') {
    throw new Error('Clipboard is not available.');
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const didCopy = document.execCommand?.('copy') ?? false;

    if (!didCopy) {
      throw new Error('Copy command failed.');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

async function copyText(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  copyWithTextareaFallback(value);
}

function renderInlineCode(text: string): ReactNode {
  const segments = text.split(/(`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g);

  if (segments.length === 1) {
    return text;
  }

  return segments.map((segment, index) => {
    if (segment.startsWith('`') && segment.endsWith('`') && segment.length >= 2) {
      return <code key={`inline-code-${index}`}>{segment.slice(1, -1)}</code>;
    }

    const linkMatch = segment.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);

    if (linkMatch) {
      const [, label, href] = linkMatch;

      return (
        <a href={href} key={`inline-link-${index}`} rel="noreferrer" target="_blank">
          {label}
        </a>
      );
    }

    return <Fragment key={`inline-text-${index}`}>{segment}</Fragment>;
  });
}

const initialColor: RGBAColor = {
  r: 61,
  g: 145,
  b: 255,
  a: 1,
};

const heroPickerCards = [
  {
    id: 'sketch',
    title: 'Sketch',
    description: 'Full controls for hue, alpha, and saved swatches.',
    component: SketchPicker,
  },
  {
    id: 'chrome',
    title: 'Chrome',
    description: 'The classic all-purpose picker for raw color editing.',
    component: ChromePicker,
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'Fast palette selection when you want decisive defaults.',
    component: GithubPicker,
  },
  {
    id: 'compact',
    title: 'Compact',
    description: 'Dense preset mode for quick iteration in tight layouts.',
    component: CompactPicker,
  },
] as const;

const pickerGalleryIntro =
  'Compare every public picker export, copy the import shape, and jump straight to the props that make each component different.';

const pickerGalleryNote =
  'Each picker keeps the same top-level package import and also documents the compatible deep import path for existing integrations.';

function formatBackground(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const glowAlpha = Math.max(alpha * 0.32, 0.18);
  const washAlpha = Math.max(alpha * 0.12, 0.08);

  return {
    '--site-accent': `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`,
    '--site-accent-soft': `rgba(${color.r}, ${color.g}, ${color.b}, ${glowAlpha})`,
    '--site-accent-wash': `rgba(${color.r}, ${color.g}, ${color.b}, ${washAlpha})`,
  } as CSSProperties;
}

function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function colorToHex(color: RGBAColor) {
  const toHex = (value: number) => clampColorChannel(value).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
}

function createPaletteStops(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const offsets = [120, 48, -18, -80];

  return offsets.map((offset, index) => {
    const mix = index < 2 ? 0.28 : 0.16;
    const target = index < 2 ? 255 : 12;

    const channel = (value: number) => clampColorChannel(value + (target - value) * mix + offset * 0.08);

    return `rgba(${channel(color.r)}, ${channel(color.g)}, ${channel(color.b)}, ${Math.max(alpha * 0.92, 0.84)})`;
  });
}

function createNavItems(section: ContentSection) {
  return {
    id: section.id,
    title: section.title,
    subsections:
      section.subsections?.map((subsection): NavSubsection => {
        const children =
          subsection.id === 'picker-specific-props'
            ? (subsection.propertyGroups ?? []).map((group) => ({
                id: createPropertyGroupAnchorId(subsection, group),
                title: group.title,
              }))
            : [];

        return {
          ...subsection,
          children,
        };
      }) ?? [],
  };
}

function createPropertyGroupAnchorId(subsection: ContentSubsection, group: PropertyGroup) {
  return `${subsection.id}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function createAnchorSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createPropertyAnchorId(subsection: ContentSubsection, group: PropertyGroup, property: ApiProperty) {
  return `${createPropertyGroupAnchorId(subsection, group)}-${createAnchorSlug(property.name)}`;
}

function getPropertyGroupAnchorId(subsection: ContentSubsection, group: PropertyGroup) {
  return subsection.id === 'picker-specific-props' ? createPropertyGroupAnchorId(subsection, group) : undefined;
}

function getPropertyAnchorId(subsection: ContentSubsection, group: PropertyGroup, property: ApiProperty) {
  return subsection.id === 'picker-specific-props' ? createPropertyAnchorId(subsection, group, property) : undefined;
}

function getAnchorIds() {
  return siteSections.flatMap((section) => [
    section.id,
    ...(section.subsections?.flatMap((subsection) => [
      subsection.id,
      ...(subsection.id === 'picker-specific-props'
        ? (subsection.propertyGroups?.flatMap((group) => [
            createPropertyGroupAnchorId(subsection, group),
            ...group.properties.map((property) => createPropertyAnchorId(subsection, group, property)),
          ]) ?? [])
        : []),
    ]) ?? []),
  ]);
}

function stripSearchText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSearchableBlockText(block: SectionBlock) {
  if (block.type === 'text') {
    return block.text;
  }

  if (block.type === 'bullets') {
    return block.items.join(' ');
  }

  if (block.type === 'package-manager') {
    return [block.label, ...Object.values(block.commands)].filter(Boolean).join(' ');
  }

  return [block.label, block.code].filter(Boolean).join(' ');
}

function createSearchIndex(): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];

  siteSections.forEach((section) => {
    entries.push({
      id: `section-${section.id}`,
      anchorId: section.id,
      title: section.title,
      kind: 'section',
      content: stripSearchText([section.title, section.intro, ...section.blocks.map(getSearchableBlockText)].join(' ')),
    });

    section.subsections?.forEach((subsection) => {
      entries.push({
        id: `section-${subsection.id}`,
        anchorId: subsection.id,
        title: subsection.title,
        kind: 'section',
        content: stripSearchText(
          [section.title, subsection.title, subsection.intro, ...(subsection.blocks?.map(getSearchableBlockText) ?? [])]
            .filter(Boolean)
            .join(' '),
        ),
      });

      subsection.blocks?.forEach((block, blockIndex) => {
        if ((block.type === 'code' || block.type === 'package-manager') && block.label) {
          entries.push({
            id: `example-${subsection.id}-${blockIndex}`,
            anchorId: subsection.id,
            title: block.label,
            kind: 'example',
            content: stripSearchText([section.title, subsection.title, getSearchableBlockText(block)].join(' ')),
          });
        }
      });

      subsection.propertyGroups?.forEach((group) => {
        const groupAnchorId = getPropertyGroupAnchorId(subsection, group) ?? subsection.id;

        entries.push({
          id: `group-${subsection.id}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          anchorId: groupAnchorId,
          title: group.title,
          kind: 'section',
          content: stripSearchText(
            [section.title, subsection.title, group.title, group.summary].filter(Boolean).join(' '),
          ),
        });

        group.properties.forEach((property) => {
          const propertyAnchorId = getPropertyAnchorId(subsection, group, property) ?? groupAnchorId;

          entries.push({
            id: `prop-${groupAnchorId}-${property.name}`,
            anchorId: propertyAnchorId,
            title: `${property.name} in ${group.title}`,
            kind: 'prop',
            content: stripSearchText(
              [
                section.title,
                subsection.title,
                group.title,
                property.name,
                property.type,
                property.defaultValue,
                property.description,
              ]
                .filter(Boolean)
                .join(' '),
            ),
          });
        });
      });
    });
  });

  pickerMetadata.forEach((picker) => {
    entries.push({
      id: `picker-${picker.id}`,
      anchorId: picker.apiAnchor,
      title: picker.exportName,
      kind: 'picker',
      content: stripSearchText(
        [picker.title, picker.exportName, picker.deepImport, picker.summary, ...picker.badges].join(' '),
      ),
    });
  });

  return entries;
}

const searchIndex = createSearchIndex();

function getInitialSearchQuery() {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get('q') ?? '';
}

function createSearchSnippet(content: string, query: string) {
  const normalizedContent = stripSearchText(content);
  const normalizedQuery = query.trim().toLowerCase();
  const matchIndex = normalizedContent.toLowerCase().indexOf(normalizedQuery);

  if (!normalizedQuery || matchIndex < 0) {
    return normalizedContent.slice(0, 132);
  }

  const start = Math.max(0, matchIndex - 48);
  const end = Math.min(normalizedContent.length, matchIndex + normalizedQuery.length + 84);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < normalizedContent.length ? '...' : '';

  return `${prefix}${normalizedContent.slice(start, end)}${suffix}`;
}

function searchDocs(query: string): SearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  return searchIndex
    .map((entry) => {
      const haystack = `${entry.title} ${entry.content}`.toLowerCase();
      const matches = terms.filter((term) => haystack.includes(term));

      if (matches.length === 0) {
        return null;
      }

      const titleMatchScore = terms.filter((term) => entry.title.toLowerCase().includes(term)).length * 3;
      const kindScore = entry.kind === 'prop' ? 2 : entry.kind === 'picker' ? 1 : 0;

      return {
        ...entry,
        snippet: createSearchSnippet(entry.content, terms[0] ?? query),
        score: matches.length + titleMatchScore + kindScore,
      };
    })
    .filter((entry): entry is SearchResult & { score: number } => Boolean(entry))
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, 12)
    .map(({ score: _score, ...entry }) => entry);
}

function isTextEntryTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
}

function findNearestAnchorId(anchorIds: string[]) {
  const readingLine = Math.min(160, window.innerHeight * 0.24);

  return anchorIds
    .map((id) => {
      const element = document.getElementById(id);

      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const isReadable = rect.bottom >= 0 && rect.top <= window.innerHeight;

      if (!isReadable) {
        return null;
      }

      return {
        id,
        distance: Math.abs(rect.top - readingLine),
      };
    })
    .filter((entry): entry is { id: string; distance: number } => Boolean(entry))
    .sort((left, right) => left.distance - right.distance)[0]?.id;
}

function isSubsectionActive(subsection: NavSubsection, activeAnchorId: string) {
  return (
    subsection.id === activeAnchorId ||
    subsection.children.some((child) => child.id === activeAnchorId || activeAnchorId.startsWith(`${child.id}-`))
  );
}

interface CodeFigureProps {
  code: string;
  language: CodeBlock['language'];
  label?: string;
  copyValue?: string;
  packageManagerControls?: ReactNode;
}

function CodeFigure({ code, language, label, copyValue, packageManagerControls }: CodeFigureProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timeoutRef = useRef<number | undefined>(undefined);
  const valueToCopy = copyValue ?? code;
  const buttonLabel = copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Retry Copy' : 'Copy';
  const statusLabel =
    copyState === 'copied'
      ? 'Code copied to clipboard.'
      : copyState === 'error'
        ? 'Copy failed. Try again.'
        : 'Copy code to clipboard.';

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    try {
      await copyText(valueToCopy);
      setCopyState('copied');
      timeoutRef.current = window.setTimeout(() => {
        setCopyState('idle');
      }, 1800);
    } catch {
      setCopyState('error');
    }
  };

  return (
    <figure className="content-code">
      <div className="content-code__header">
        <div className="content-code__meta">
          {label ? <figcaption>{label}</figcaption> : null}
          <span className="content-code__language">{language}</span>
        </div>
        <button
          className={`content-code__copy content-code__copy--${copyState}`}
          type="button"
          onClick={handleCopy}
          aria-label={`${buttonLabel}: ${label ?? `${language} snippet`}`}
        >
          {buttonLabel}
        </button>
      </div>

      {packageManagerControls}

      <pre>
        <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
      </pre>
      <span className="content-code__status" aria-live="polite">
        {statusLabel}
      </span>
    </figure>
  );
}

interface RenderBlockOptions {
  packageManager: PackageManager;
  setPackageManager: (manager: PackageManager) => void;
}

function renderBlock(block: SectionBlock, index: number, options: RenderBlockOptions) {
  if (block.type === 'text') {
    return (
      <p className="content-text" key={`text-${index}`}>
        {renderInlineCode(block.text)}
      </p>
    );
  }

  if (block.type === 'bullets') {
    return (
      <ul className="content-list" key={`bullets-${index}`}>
        {block.items.map((item) => (
          <li key={item}>{renderInlineCode(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === 'package-manager') {
    const command = block.commands[options.packageManager];
    const tabs = (
      <div className="package-manager-tabs" role="tablist" aria-label="Package manager">
        {packageManagers.map((manager) => (
          <button
            className={`package-manager-tabs__tab${
              options.packageManager === manager ? ' package-manager-tabs__tab--active' : ''
            }`}
            key={manager}
            type="button"
            role="tab"
            aria-selected={options.packageManager === manager}
            onClick={() => options.setPackageManager(manager)}
          >
            {manager}
          </button>
        ))}
      </div>
    );

    return (
      <CodeFigure
        code={command}
        key={`package-manager-${index}-${block.label ?? 'snippet'}`}
        language="bash"
        label={block.label}
        packageManagerControls={tabs}
      />
    );
  }

  return (
    <CodeFigure
      code={block.code}
      copyValue={block.copyValue}
      key={`code-${index}-${block.label ?? 'snippet'}`}
      language={block.language}
      label={block.label}
    />
  );
}

function ApiDefaultValue({ value }: { value?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!value) {
    return <span className="api-default api-default--empty">None</span>;
  }

  const isLongDefault = value.length > 48;

  if (!isLongDefault) {
    return <code className="api-default">{value}</code>;
  }

  return (
    <div className={`api-default api-default--long${isExpanded ? ' api-default--expanded' : ''}`}>
      <button className="api-default__toggle" type="button" onClick={() => setIsExpanded((current) => !current)}>
        {isExpanded ? 'Hide default' : 'Show default'}
      </button>
      {isExpanded ? <code className="api-default__value">{value}</code> : null}
    </div>
  );
}

function PickerPreview({ picker }: { picker: PickerMetadata }) {
  const colors = ['#D0021B', '#F5A623', '#7ED321', '#4A90E2', '#9013FE', '#50E3C2'];
  const isSlider = picker.badges.includes('slider');
  const isFullEditor = picker.badges.includes('full editor');

  return (
    <div className={`picker-gallery__preview picker-gallery__preview--${picker.id}`} aria-hidden="true">
      {isFullEditor ? (
        <>
          <span className="picker-gallery__saturation" />
          <span className="picker-gallery__rail picker-gallery__rail--hue" />
          {picker.badges.includes('alpha') ? (
            <span className="picker-gallery__rail picker-gallery__rail--alpha" />
          ) : null}
          <span className="picker-gallery__fields" />
        </>
      ) : isSlider ? (
        <>
          <span className="picker-gallery__rail picker-gallery__rail--hue" />
          {picker.badges.includes('alpha') ? (
            <span className="picker-gallery__rail picker-gallery__rail--alpha" />
          ) : null}
        </>
      ) : (
        <span className="picker-gallery__swatches">
          {colors.map((color) => (
            <span key={`${picker.id}-${color}`} style={{ backgroundColor: color }} />
          ))}
        </span>
      )}
    </div>
  );
}

function PickerGallery() {
  return (
    <div className="picker-gallery" aria-label="Public picker components">
      {pickerMetadata.map((picker) => {
        const importSnippet = `import { ${picker.exportName} } from 'react-color';`;

        return (
          <article className="picker-gallery__item" id={`picker-${picker.id}`} key={picker.id}>
            <PickerPreview picker={picker} />
            <div className="picker-gallery__content">
              <div className="picker-gallery__head">
                <h3>{picker.title}</h3>
                <code>{picker.exportName}</code>
              </div>
              <p>{picker.summary}</p>
              <div className="picker-gallery__badges" aria-label={`${picker.title} capabilities`}>
                {picker.badges.map((badge) => (
                  <span key={`${picker.id}-${badge}`}>{badge}</span>
                ))}
              </div>
              <div className="picker-gallery__imports">
                <code>{importSnippet}</code>
                <code>{picker.deepImport}</code>
              </div>
              <Link className="picker-gallery__api-link" to="/" hash={picker.apiAnchor}>
                API props
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ApiPropertyName({
  subsection,
  group,
  property,
}: {
  subsection: ContentSubsection;
  group: PropertyGroup;
  property: ApiProperty;
}) {
  const propertyAnchorId = getPropertyAnchorId(subsection, group, property);

  if (!propertyAnchorId) {
    return <>{renderInlineCode(property.name)}</>;
  }

  return (
    <a className="api-property-anchor" href={`#${propertyAnchorId}`}>
      <code>{property.name}</code>
    </a>
  );
}

function ApiPropertyCards({ group, subsection }: { group: PropertyGroup; subsection: ContentSubsection }) {
  if (group.properties.length === 0) {
    return <p className="api-empty">No picker-specific props.</p>;
  }

  return (
    <div className="api-prop-cards" aria-label={`${group.title} props`}>
      {group.properties.map((property) => (
        <article className="api-prop-card" key={`${group.title}-${property.name}-card`}>
          <div>
            <span>Prop</span>
            <strong>
              <ApiPropertyName group={group} property={property} subsection={subsection} />
            </strong>
          </div>
          <div>
            <span>Type</span>
            <code>{property.type}</code>
          </div>
          <div>
            <span>Default</span>
            <ApiDefaultValue value={property.defaultValue} />
          </div>
          <div>
            <span>Description</span>
            <p>{renderInlineCode(property.description)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function renderSection(section: ContentSection, options: RenderBlockOptions) {
  return (
    <section className="section" id={section.id} key={section.id}>
      <div className="section__panel">
        <div className="section__body">
          <h2>{section.title}</h2>
          {section.intro ? <p className="section__intro">{renderInlineCode(section.intro)}</p> : null}
          {section.blocks.map((block, index) => renderBlock(block, index, options))}

          {section.subsections?.map((subsection) => (
            <div className="section__subsection" id={subsection.id} key={subsection.id}>
              <h3>{subsection.title}</h3>
              {subsection.intro ? (
                <p className="section__intro section__intro--subsection">{renderInlineCode(subsection.intro)}</p>
              ) : null}
              {subsection.blocks?.map((block, index) => renderBlock(block, index, options))}

              {subsection.propertyGroups?.map((group) => (
                <div className="api-group" id={getPropertyGroupAnchorId(subsection, group)} key={group.title}>
                  <div className="api-group__head">
                    <h4>{group.title}</h4>
                    {group.summary ? <p>{renderInlineCode(group.summary)}</p> : null}
                  </div>
                  {group.properties.map((property) => {
                    const propertyAnchorId = getPropertyAnchorId(subsection, group, property);

                    return propertyAnchorId ? (
                      <span
                        className="api-property-target"
                        id={propertyAnchorId}
                        key={`${group.title}-${property.name}-target`}
                      />
                    ) : null;
                  })}

                  <table className="api-table">
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.properties.map((property) => (
                        <tr key={`${group.title}-${property.name}`}>
                          <th scope="row">
                            <ApiPropertyName group={group} property={property} subsection={subsection} />
                          </th>
                          <td>
                            <code className="api-type">{property.type}</code>
                          </td>
                          <td>
                            <ApiDefaultValue value={property.defaultValue} />
                          </td>
                          <td>{renderInlineCode(property.description)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <ApiPropertyCards group={group} subsection={subsection} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderAnchorNavigation(activeAnchorId: string, onNavigate?: () => void, className = 'section-nav') {
  const navSections = siteSections.map(createNavItems);

  return (
    <nav className={className} aria-label="Section navigation">
      <div className="section-nav__eyebrow">Jump to section</div>
      <ul className="section-nav__list">
        {navSections.map((section) => {
          const isSectionActive =
            activeAnchorId === section.id ||
            section.subsections.some((subsection) => isSubsectionActive(subsection, activeAnchorId));

          return (
            <li className="section-nav__item" key={section.id}>
              <a
                className={`section-nav__link${isSectionActive ? ' section-nav__link--active' : ''}`}
                href={`#${section.id}`}
                aria-current={activeAnchorId === section.id ? 'location' : undefined}
                onClick={onNavigate}
              >
                <span className="section-nav__index">
                  {String(siteSections.findIndex((entry) => entry.id === section.id) + 2).padStart(2, '0')}
                </span>
                <span>{section.title}</span>
              </a>

              {section.subsections.length > 0 ? (
                <ul className="section-nav__sublist">
                  {section.subsections.map((subsection) => (
                    <li key={subsection.id}>
                      <a
                        className={`section-nav__sublink${
                          isSubsectionActive(subsection, activeAnchorId) ? ' section-nav__sublink--active' : ''
                        }`}
                        href={`#${subsection.id}`}
                        aria-current={activeAnchorId === subsection.id ? 'location' : undefined}
                        onClick={onNavigate}
                      >
                        {subsection.title}
                      </a>
                      {subsection.children.length > 0 ? (
                        <ul className="section-nav__childlist">
                          {subsection.children.map((child) => (
                            <li key={child.id}>
                              <a
                                className={`section-nav__childlink${
                                  activeAnchorId === child.id || activeAnchorId.startsWith(`${child.id}-`)
                                    ? ' section-nav__childlink--active'
                                    : ''
                                }`}
                                href={`#${child.id}`}
                                aria-current={activeAnchorId === child.id ? 'location' : undefined}
                                onClick={onNavigate}
                              >
                                {child.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface SearchNavigationProps {
  id: string;
  query: string;
  results: SearchResult[];
  inputRef?: RefObject<HTMLInputElement | null>;
  onQueryChange: (query: string) => void;
  onNavigate?: () => void;
}

function SearchNavigation({ id, query, results, inputRef, onQueryChange, onNavigate }: SearchNavigationProps) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="docs-search">
      <label className="docs-search__label" htmlFor={id}>
        Search documentation
      </label>
      <div className="docs-search__field">
        <span className="docs-search__icon" aria-hidden="true">
          /
        </span>
        <input
          id={id}
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search props, pickers, examples..."
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
        {hasQuery ? (
          <button className="docs-search__clear" type="button" onClick={() => onQueryChange('')}>
            Clear
          </button>
        ) : null}
      </div>

      {hasQuery ? (
        <div className="docs-search__results" aria-live="polite">
          {results.length > 0 ? (
            <ul className="docs-search__result-list">
              {results.map((result) => (
                <li key={result.id}>
                  <a className="docs-search__result" href={`#${result.anchorId}`} onClick={onNavigate}>
                    <span className="docs-search__result-head">
                      <span className="docs-search__result-title">{result.title}</span>
                      <span className={`docs-search__kind docs-search__kind--${result.kind}`}>{result.kind}</span>
                    </span>
                    <span className="docs-search__snippet">{result.snippet}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="docs-search__empty">
              <strong>No results found</strong>
              <span>Try onChange, Sketch, or presetColors.</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function PickerGalleryPage() {
  return (
    <div className="gallery-page">
      <nav className="page-breadcrumbs" aria-label="Page navigation">
        <Link to="/" hash="about">
          Documentation
        </Link>
        <span aria-hidden="true">/</span>
        <span>Picker Gallery</span>
      </nav>

      <section className="gallery-page__intro" id="picker-gallery" aria-labelledby="picker-gallery-title">
        <p className="eyebrow">Picker Gallery</p>
        <div className="gallery-page__intro-grid">
          <div>
            <h2 id="picker-gallery-title">Every public picker, one import map.</h2>
            <p>{pickerGalleryIntro}</p>
          </div>
          <div className="gallery-page__note">
            <strong>{pickerMetadata.length} picker exports</strong>
            <span>{pickerGalleryNote}</span>
          </div>
        </div>
      </section>

      <PickerGallery />
    </div>
  );
}

function AppShell() {
  const [color, setColor] = useState<RGBAColor>(initialColor);
  const [packageManager, setPackageManagerState] = useState<PackageManager>(getInitialPackageManager);
  const drawerToggleRef = useRef<HTMLButtonElement>(null);
  const drawerPanelRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  const [activeAnchorId, setActiveAnchorId] = useState<string>(() => {
    const defaultId = siteSections[0]?.id ?? 'about';

    if (typeof window === 'undefined') {
      return defaultId;
    }

    const hash = window.location.hash.replace('#', '');
    const anchorIds = getAnchorIds();

    return hash && anchorIds.includes(hash) ? hash : defaultId;
  });
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [drawerFocusRestoreRequest, setDrawerFocusRestoreRequest] = useState(0);
  const searchResults = searchDocs(searchQuery);
  const currentPathname = useRouterState({ select: (state) => state.location.pathname });
  const isGalleryPage = currentPathname === galleryPagePath;
  const alpha = color.a ?? 1;
  const rgbaLabel = `rgba(${clampColorChannel(color.r)}, ${clampColorChannel(color.g)}, ${clampColorChannel(color.b)}, ${alpha.toFixed(2)})`;
  const paletteStops = createPaletteStops(color);
  const closeNavDrawer = useCallback(() => {
    setDrawerFocusRestoreRequest((request) => request + 1);
    setIsNavDrawerOpen(false);
  }, []);
  const setPackageManager = useCallback((manager: PackageManager) => {
    setPackageManagerState(manager);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(packageManagerStorageKey, manager);
    }
  }, []);
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const url = new URL(window.location.href);
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      url.searchParams.set('q', trimmedQuery);
    } else {
      url.searchParams.delete('q');
    }

    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handlePopState = () => {
      setSearchQuery(new URLSearchParams(window.location.search).get('q') ?? '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !isTextEntryTarget(event.target)) {
        event.preventDefault();
        (isNavDrawerOpen ? mobileSearchRef.current : desktopSearchRef.current)?.focus();
        return;
      }

      if (event.key === 'Escape' && searchQuery.trim()) {
        event.preventDefault();
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavDrawerOpen, searchQuery]);

  useEffect(() => {
    const anchorIds = getAnchorIds();

    if (typeof window === 'undefined') {
      return undefined;
    }

    let animationFrame = 0;

    const updateActiveFromScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const hash = window.location.hash.replace('#', '');

        if (hash && anchorIds.includes(hash)) {
          setActiveAnchorId(hash);
          return;
        }

        const nextActiveId = findNearestAnchorId(anchorIds);

        if (nextActiveId) {
          setActiveAnchorId(nextActiveId);
        }
      });
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && anchorIds.includes(hash)) {
        setActiveAnchorId(hash);
      }
      closeNavDrawer();
    };

    const handleResize = () => {
      if (window.innerWidth > 920) {
        setIsNavDrawerOpen(false);
      }
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateActiveFromScroll);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [closeNavDrawer]);

  useEffect(() => {
    if (!isNavDrawerOpen || typeof document === 'undefined') {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerPanelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !searchQuery.trim()) {
        event.preventDefault();
        closeNavDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeNavDrawer, isNavDrawerOpen, searchQuery]);

  useEffect(() => {
    if (!isNavDrawerOpen && drawerFocusRestoreRequest > 0) {
      drawerToggleRef.current?.focus();
    }
  }, [drawerFocusRestoreRequest, isNavDrawerOpen]);

  return (
    <div className="site-shell" style={formatBackground(color)}>
      <a className="skip-link" href="#site-documentation">
        Skip to documentation
      </a>
      <div className="site-shell__ambient site-shell__ambient--grid" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--one" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--two" aria-hidden="true" />

      <header className="hero">
        <div className="hero__backdrop hero__backdrop--left" aria-hidden="true" />
        <div className="hero__backdrop hero__backdrop--right" aria-hidden="true" />

        <div className="hero__content">
          <div className="hero__masthead">
            <div className="hero__brand">
              <span className="hero__brand-mark" aria-hidden="true" />
              <div className="hero__brand-copy">
                <strong>react-color</strong>
                <span>Modern React color pickers</span>
              </div>
            </div>
            <span className="hero__status">Actively maintained fork</span>
          </div>

          <p className="eyebrow">React color pickers</p>
          <h1>Real pickers, one reliable color state.</h1>
          <p className="hero__lede">
            Drop in familiar picker components, control them from React state, and customize the look with published CSS
            hooks.
          </p>

          <div className="hero__metrics" aria-label="Current shared color values">
            <div className="hero__metric hero__metric--swatch">
              <span className="hero__swatch" style={{ backgroundColor: rgbaLabel }} />
              <div>
                <strong>{colorToHex(color)}</strong>
                <span>Current color</span>
              </div>
            </div>
            <div className="hero__metric">
              <strong>{rgbaLabel}</strong>
              <span>RGBA value</span>
            </div>
            <div className="hero__metric">
              <strong>{heroPickerCards.length} synced demos</strong>
              <span>Interactive pickers</span>
            </div>
          </div>

          <div className="hero__actions">
            <Link className="hero__button hero__button--primary" to="/" hash="about">
              Read the docs
            </Link>
            <Link className="hero__button" to={galleryPagePath}>
              Picker Gallery
            </Link>
            <a className="hero__button" href="https://github.com/antonlimar/react-color">
              View repository
            </a>
          </div>

          <div className="hero__palette" aria-label="Current color family">
            <span className="hero__palette-label">Current color scale</span>
            <div className="hero__palette-track">
              {paletteStops.map((stop, index) => (
                <span className="hero__palette-stop" key={`${stop}-${index}`} style={{ backgroundColor: stop }} />
              ))}
            </div>
          </div>
        </div>

        <div className="hero__demo" aria-label="Synchronized live picker demo">
          <div className="hero__demo-head">
            <div>
              <span className="hero__demo-label">Synchronized pickers</span>
              <p className="hero__demo-copy">Each panel reads and writes the same React color value.</p>
            </div>
            <span className="hero__demo-value">{colorToHex(color)}</span>
          </div>

          <div className="hero__picker-grid">
            {heroPickerCards.map(({ id, title, description, component: PickerComponent }) => (
              <article className={`hero__picker-card hero__picker-card--${id}`} key={id}>
                <div className="hero__picker-meta">
                  <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                  <span className="hero__picker-chip">{title}</span>
                </div>

                <div className="hero__picker-surface">
                  <PickerComponent color={color} onChange={(nextColor: ColorResult) => setColor(nextColor.rgb)} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </header>

      <main className={`sections-shell${isGalleryPage ? ' sections-shell--gallery-page' : ''}`} id="site-documentation">
        {isGalleryPage ? (
          <PickerGalleryPage />
        ) : (
          <>
            <section className="sections-shell__intro" aria-label="Documentation overview">
              <div className="sections-shell__intro-copy">
                <p className="eyebrow">Documentation</p>
                <h2>Install, configure, and customize the pickers without guesswork.</h2>
              </div>
              <div className="sections-shell__intro-card">
                <strong>Stable public API</strong>
                <span>Named picker exports, deep imports, and CSS entrypoints are documented below.</span>
                <Link className="sections-shell__intro-link" to={galleryPagePath}>
                  Open Picker Gallery
                </Link>
              </div>
            </section>

            <div className="sections-shell__toolbar">
              <button
                className="sections-shell__drawer-toggle"
                ref={drawerToggleRef}
                type="button"
                aria-expanded={isNavDrawerOpen}
                aria-controls="mobile-section-nav"
                onClick={() => setIsNavDrawerOpen((current) => !current)}
              >
                <span>Browse sections</span>
                <span className="sections-shell__drawer-meta">
                  {siteSections.find((section) => section.id === activeAnchorId)?.title ??
                    siteSections.find((section) =>
                      section.subsections?.some((subsection) => subsection.id === activeAnchorId),
                    )?.title ??
                    'Navigation'}
                </span>
              </button>
            </div>

            <div className="sections-layout">
              <aside className="sections-layout__sidebar">
                <SearchNavigation
                  id="desktop-docs-search"
                  inputRef={desktopSearchRef}
                  query={searchQuery}
                  results={searchResults}
                  onQueryChange={handleSearchQueryChange}
                />
                {searchQuery.trim() ? null : renderAnchorNavigation(activeAnchorId)}
              </aside>

              <div
                className={`sections-shell__drawer${isNavDrawerOpen ? ' sections-shell__drawer--open' : ''}`}
                hidden={!isNavDrawerOpen}
                aria-hidden={!isNavDrawerOpen}
              >
                <button
                  className="sections-shell__drawer-backdrop"
                  type="button"
                  aria-label="Close section navigation"
                  onClick={closeNavDrawer}
                />
                <div
                  className="sections-shell__drawer-panel"
                  id="mobile-section-nav"
                  ref={drawerPanelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-section-nav-title"
                  tabIndex={-1}
                >
                  <div className="sections-shell__drawer-head">
                    <div>
                      <p className="sections-shell__drawer-eyebrow">Mobile navigation</p>
                      <strong id="mobile-section-nav-title">Docs anchors</strong>
                    </div>
                    <button
                      className="sections-shell__drawer-close"
                      type="button"
                      aria-label="Close section navigation"
                      onClick={closeNavDrawer}
                    >
                      Close
                    </button>
                  </div>
                  <SearchNavigation
                    id="mobile-docs-search"
                    inputRef={mobileSearchRef}
                    query={searchQuery}
                    results={searchResults}
                    onNavigate={closeNavDrawer}
                    onQueryChange={handleSearchQueryChange}
                  />
                  {searchQuery.trim()
                    ? null
                    : renderAnchorNavigation(activeAnchorId, closeNavDrawer, 'section-nav section-nav--drawer')}
                </div>
              </div>

              <div className="sections">
                {siteSections.map((section) => renderSection(section, { packageManager, setPackageManager }))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function EmptyRoute() {
  return null;
}

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: EmptyRoute,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: galleryPagePath,
  component: EmptyRoute,
});

const routeTree = rootRoute.addChildren([indexRoute, galleryRoute]);

const router = createRouter({
  routeTree,
  basepath: normalizeRouterBasepath(import.meta.env.BASE_URL),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
