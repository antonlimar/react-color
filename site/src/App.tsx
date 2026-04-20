import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode, RefObject } from 'react';
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
import {
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  CompactPicker,
  GithubPicker,
  GooglePicker,
  HuePicker,
  MaterialPicker,
  PhotoshopPicker,
  SketchPicker,
  SliderPicker,
  SwatchesPicker,
  TwitterPicker,
} from 'react-color';
import type { ColorPickerComponent, ColorPickerProps, ColorResult, RGBAColor } from 'react-color';
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

type AnchorHeadingLevel = 2 | 3 | 4;

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

const pickerGalleryComponents: Record<string, ColorPickerComponent> = {
  alpha: AlphaPicker,
  block: BlockPicker,
  chrome: ChromePicker,
  circle: CirclePicker,
  compact: CompactPicker,
  github: GithubPicker,
  google: GooglePicker,
  hue: HuePicker,
  material: MaterialPicker,
  photoshop: PhotoshopPicker,
  sketch: SketchPicker,
  slider: SliderPicker,
  swatches: SwatchesPicker,
  twitter: TwitterPicker,
};

const pickerGalleryPreviewProps: Record<string, ColorPickerProps> = {
  alpha: { width: '100%' },
  google: { width: 420 },
  hue: { width: '100%' },
  material: {
    styles: {
      default: {
        bg: {
          borderRadius: 16,
          boxShadow: 'var(--site-picker-gallery-shadow)',
        },
        material: {
          height: 'auto',
          minHeight: 112,
        },
      },
    },
  },
  photoshop: {
    onCancel: () => undefined,
    styles: { default: { picker: { boxShadow: 'var(--site-picker-gallery-shadow)' } } },
  },
  slider: { styles: { default: { wrap: { width: '100%' } } } },
  swatches: { width: 320, height: 220 },
};

const pickerGalleryIntro =
  'Use this gallery to compare the bundled picker layouts side by side: full editors for precise input, palette pickers for presets, and sliders for focused hue or alpha controls.';

const pickerGalleryNote =
  'Every card shows the named package import and links to the picker-specific props, so you can copy the component shape without digging through the API reference.';

function formatBackground(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const glowAlpha = Math.max(alpha * 0.32, 0.18);
  const pageAlpha = Math.max(alpha * 0.18, 0.12);
  const floorAlpha = Math.max(alpha * 0.42, 0.28);
  const washAlpha = Math.max(alpha * 0.12, 0.08);

  return {
    '--site-accent': `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`,
    '--site-accent-soft': `rgba(${color.r}, ${color.g}, ${color.b}, ${glowAlpha})`,
    '--site-accent-page': `rgba(${color.r}, ${color.g}, ${color.b}, ${pageAlpha})`,
    '--site-accent-floor': `rgba(${color.r}, ${color.g}, ${color.b}, ${floorAlpha})`,
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

function isAnchorNavigationSettled(anchorId: string) {
  const element = document.getElementById(anchorId);

  if (!element) {
    return true;
  }

  const rect = element.getBoundingClientRect();
  const settledLine = Math.min(180, window.innerHeight * 0.3);

  return rect.top >= 0 && rect.top <= settledLine;
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

type CodeCopyState = 'idle' | 'copied' | 'error';

function useCodeCopy(valueToCopy: string) {
  const [copyState, setCopyState] = useState<CodeCopyState>('idle');
  const timeoutRef = useRef<number | undefined>(undefined);
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

  const handleCopy = useCallback(async () => {
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
  }, [valueToCopy]);

  return {
    buttonLabel,
    copyState,
    handleCopy,
    statusLabel,
  };
}

function CodeFigure({ code, language, label, copyValue, packageManagerControls }: CodeFigureProps) {
  const valueToCopy = copyValue ?? code;
  const { buttonLabel, copyState, handleCopy, statusLabel } = useCodeCopy(valueToCopy);

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

function LivePickerPreview({
  picker,
  color,
  onChange,
}: {
  picker: PickerMetadata;
  color: RGBAColor;
  onChange: (color: ColorResult) => void;
}) {
  const PickerComponent = pickerGalleryComponents[picker.id];

  if (!PickerComponent) {
    return null;
  }

  return (
    <div
      className={`picker-gallery__preview picker-gallery__preview--${picker.id}`}
      aria-label={`${picker.title} live demo`}
    >
      <div className="picker-gallery__live">
        <PickerComponent
          color={color}
          onChange={onChange}
          onAccept={onChange}
          {...(pickerGalleryPreviewProps[picker.id] ?? {})}
        />
      </div>
    </div>
  );
}

function PickerImportSnippet({ picker, code }: { picker: PickerMetadata; code: string }) {
  const { buttonLabel, copyState, handleCopy, statusLabel } = useCodeCopy(code);

  return (
    <div className="picker-gallery__imports">
      <div className="picker-gallery__imports-header">
        <span>Import</span>
        <button
          className={`content-code__copy content-code__copy--${copyState} picker-gallery__copy`}
          type="button"
          onClick={handleCopy}
          aria-label={`${buttonLabel}: ${picker.title} import`}
        >
          {buttonLabel}
        </button>
      </div>
      <pre>
        <code className="language-tsx" dangerouslySetInnerHTML={{ __html: highlightCode(code, 'tsx') }} />
      </pre>
      <span className="picker-gallery__status" aria-live="polite">
        {statusLabel}
      </span>
    </div>
  );
}

function PickerGallery({ color, onChange }: { color: RGBAColor; onChange: (color: ColorResult) => void }) {
  const handleGalleryColorChange = useCallback(
    (nextColor: ColorResult) => {
      onChange(nextColor);
    },
    [onChange],
  );
  const galleryColorLabel = colorToHex(color);

  return (
    <div className="picker-gallery" aria-label="Public picker components">
      {pickerMetadata.map((picker) => {
        const importSnippet = `import { ${picker.exportName} } from 'react-color';`;

        return (
          <article className="picker-gallery__item" id={`picker-${picker.id}`} key={picker.id}>
            <LivePickerPreview picker={picker} color={color} onChange={handleGalleryColorChange} />
            <div className="picker-gallery__content">
              <div className="picker-gallery__head">
                <h3>{picker.title}</h3>
                <div className="picker-gallery__meta">
                  <code>{picker.exportName}</code>
                  <span>{galleryColorLabel}</span>
                </div>
              </div>
              <p>{picker.summary}</p>
              <div className="picker-gallery__badges" aria-label={`${picker.title} capabilities`}>
                {picker.badges.map((badge) => (
                  <span key={`${picker.id}-${badge}`}>{badge}</span>
                ))}
              </div>
              <PickerImportSnippet picker={picker} code={importSnippet} />
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

function ApiPropertyName({ property }: { property: ApiProperty }) {
  return <>{renderInlineCode(property.name)}</>;
}

function ApiPropertyCards({ group, subsection }: { group: PropertyGroup; subsection: ContentSubsection }) {
  if (group.properties.length === 0) {
    return null;
  }

  return (
    <div className="api-prop-cards" aria-label={`${group.title} props`}>
      {group.properties.map((property) => (
        <article className="api-prop-card" key={`${group.title}-${property.name}-card`}>
          <div>
            <span>Prop</span>
            <strong>
              <ApiPropertyName property={property} />
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

function AnchorHeading({
  anchorId,
  children,
  level,
}: {
  anchorId: string;
  children: ReactNode;
  level: AnchorHeadingLevel;
}) {
  const Heading = `h${level}` as const;
  const anchor = `#${anchorId}`;

  const copyAnchor = useCallback(() => {
    void navigator.clipboard?.writeText(anchor);
  }, [anchor]);

  return (
    <Heading className="anchor-heading">
      <a className="anchor-heading__link" href={anchor} onClick={copyAnchor} title={`Copy ${anchor} anchor`}>
        <span className="anchor-heading__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M10.6 13.4a1 1 0 0 1 0-1.4l2.6-2.6a1 1 0 0 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0Z" />
            <path d="M8.1 17.3a4.2 4.2 0 0 1-5.9-5.9l3.4-3.4a4.2 4.2 0 0 1 5.9 0 1 1 0 1 1-1.4 1.4 2.2 2.2 0 0 0-3.1 0l-3.4 3.4a2.2 2.2 0 0 0 3.1 3.1l1.2-1.2a1 1 0 1 1 1.4 1.4l-1.2 1.2Z" />
            <path d="M12.5 16a1 1 0 0 1 0-1.4 2.2 2.2 0 0 0 3.1 0l3.4-3.4a2.2 2.2 0 0 0-3.1-3.1l-1.2 1.2a1 1 0 1 1-1.4-1.4l1.2-1.2a4.2 4.2 0 0 1 5.9 5.9L17 16a4.2 4.2 0 0 1-5.9 0 1 1 0 0 1 1.4 0Z" />
          </svg>
        </span>
        <span>{children}</span>
      </a>
    </Heading>
  );
}

function renderSection(section: ContentSection, options: RenderBlockOptions) {
  return (
    <section className="section" id={section.id} key={section.id}>
      <div className="section__panel">
        <div className="section__body">
          <AnchorHeading anchorId={section.id} level={2}>
            {section.title}
          </AnchorHeading>
          {section.intro ? <p className="section__intro">{renderInlineCode(section.intro)}</p> : null}
          {section.blocks.map((block, index) => renderBlock(block, index, options))}

          {section.subsections?.map((subsection) => (
            <div className="section__subsection" id={subsection.id} key={subsection.id}>
              <AnchorHeading anchorId={subsection.id} level={3}>
                {subsection.title}
              </AnchorHeading>
              {subsection.intro ? (
                <p className="section__intro section__intro--subsection">{renderInlineCode(subsection.intro)}</p>
              ) : null}
              {subsection.blocks?.map((block, index) => renderBlock(block, index, options))}

              {subsection.propertyGroups?.map((group) => {
                const groupAnchorId = createPropertyGroupAnchorId(subsection, group);

                return (
                  <div className="api-group" id={groupAnchorId} key={group.title}>
                    <div className="api-group__head">
                      <AnchorHeading anchorId={groupAnchorId} level={4}>
                        {group.title}
                      </AnchorHeading>
                      {group.summary ? <p>{renderInlineCode(group.summary)}</p> : null}
                    </div>

                    {group.properties.length > 0 ? (
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
                                <ApiPropertyName property={property} />
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
                    ) : null}
                    <ApiPropertyCards group={group} subsection={subsection} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderAnchorNavigation(
  activeAnchorId: string,
  onNavigate?: () => void,
  className = 'section-nav',
  anchorPath = '',
) {
  const navSections = siteSections.map(createNavItems);
  const isDrawerNavigation = className.split(' ').includes('section-nav--drawer');

  return (
    <div className={`section-nav-shell${isDrawerNavigation ? ' section-nav-shell--drawer' : ''}`}>
      <nav className={className} aria-label="Section navigation">
        <ul className="section-nav__list">
          {navSections.map((section) => {
            const isSectionActive =
              activeAnchorId === section.id ||
              section.subsections.some((subsection) => isSubsectionActive(subsection, activeAnchorId));

            return (
              <li className="section-nav__item" key={section.id}>
                <a
                  className={`section-nav__link${isSectionActive ? ' section-nav__link--active' : ''}`}
                  href={`${anchorPath}#${section.id}`}
                  data-anchor-id={section.id}
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
                          href={`${anchorPath}#${subsection.id}`}
                          data-anchor-id={subsection.id}
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
                                  href={`${anchorPath}#${child.id}`}
                                  data-anchor-id={child.id}
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
      <span className="section-nav-scrollbar" aria-hidden="true" onPointerDown={handleSectionNavigationScrollbarDrag}>
        <span className="section-nav-scrollbar__thumb" />
      </span>
    </div>
  );
}

const sectionNavigationScrollbarTrackInset = 16;
const sectionNavigationScrollbarMinThumbHeight = 44;
const docsSearchScrollbarTrackInset = 8;
const docsSearchScrollbarMinThumbHeight = 44;

function updateSectionNavigationScrollbar(navigation: HTMLElement) {
  const shell = navigation.closest<HTMLElement>('.section-nav-shell');

  if (!shell) {
    return;
  }

  const scrollableDistance = navigation.scrollHeight - navigation.clientHeight;

  if (scrollableDistance <= 1) {
    shell.classList.remove('section-nav-shell--scrollable');
    return;
  }

  const trackHeight = Math.max(0, navigation.clientHeight - sectionNavigationScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    sectionNavigationScrollbarMinThumbHeight,
    (navigation.clientHeight / navigation.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
  const thumbOffset = (navigation.scrollTop / scrollableDistance) * maxThumbOffset;

  shell.classList.add('section-nav-shell--scrollable');
  shell.style.setProperty('--section-nav-scrollbar-thumb-height', `${thumbHeight}px`);
  shell.style.setProperty(
    '--section-nav-scrollbar-thumb-offset',
    `${sectionNavigationScrollbarTrackInset + thumbOffset}px`,
  );
}

function syncSectionNavigationScrollbars() {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll<HTMLElement>('.section-nav').forEach(updateSectionNavigationScrollbar);
}

function handleSectionNavigationScrollbarDrag(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  const scrollbar = event.currentTarget;
  const shell = scrollbar.closest<HTMLElement>('.section-nav-shell');
  const navigation = shell?.querySelector<HTMLElement>('.section-nav');

  if (!shell || !navigation) {
    return;
  }

  const scrollableDistance = navigation.scrollHeight - navigation.clientHeight;

  if (scrollableDistance <= 1) {
    return;
  }

  const trackHeight = Math.max(0, navigation.clientHeight - sectionNavigationScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    sectionNavigationScrollbarMinThumbHeight,
    (navigation.clientHeight / navigation.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);

  if (maxThumbOffset <= 0) {
    return;
  }

  const scrollbarRect = scrollbar.getBoundingClientRect();
  const currentThumbOffset = (navigation.scrollTop / scrollableDistance) * maxThumbOffset;
  const pointerTarget = event.target as HTMLElement;
  const didGrabThumb = Boolean(pointerTarget.closest('.section-nav-scrollbar__thumb'));
  const grabOffset = didGrabThumb
    ? event.clientY - scrollbarRect.top - sectionNavigationScrollbarTrackInset - currentThumbOffset
    : thumbHeight / 2;

  const setNavigationScrollFromPointer = (clientY: number) => {
    const nextThumbOffset = Math.min(
      maxThumbOffset,
      Math.max(0, clientY - scrollbarRect.top - sectionNavigationScrollbarTrackInset - grabOffset),
    );

    navigation.scrollTop = (nextThumbOffset / maxThumbOffset) * scrollableDistance;
    updateSectionNavigationScrollbar(navigation);
  };

  const handlePointerMove = (pointerEvent: PointerEvent) => {
    pointerEvent.preventDefault();
    setNavigationScrollFromPointer(pointerEvent.clientY);
  };

  const stopDragging = () => {
    shell.classList.remove('section-nav-shell--dragging');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
    window.removeEventListener('pointercancel', stopDragging);
    scrollbar.removeEventListener('lostpointercapture', stopDragging);
  };

  event.preventDefault();
  shell.classList.add('section-nav-shell--dragging');
  if (typeof scrollbar.setPointerCapture === 'function') {
    scrollbar.setPointerCapture(event.pointerId);
  }
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
  scrollbar.addEventListener('lostpointercapture', stopDragging);

  if (!didGrabThumb) {
    setNavigationScrollFromPointer(event.clientY);
  }
}

function updateDocsSearchScrollbar(results: HTMLElement) {
  const shell = results.closest<HTMLElement>('.docs-search__results-shell');

  if (!shell) {
    return;
  }

  const scrollableDistance = results.scrollHeight - results.clientHeight;

  if (scrollableDistance <= 1) {
    shell.classList.remove('docs-search__results-shell--scrollable');
    return;
  }

  const trackHeight = Math.max(0, results.clientHeight - docsSearchScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    docsSearchScrollbarMinThumbHeight,
    (results.clientHeight / results.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
  const thumbOffset = (results.scrollTop / scrollableDistance) * maxThumbOffset;

  shell.classList.add('docs-search__results-shell--scrollable');
  shell.style.setProperty('--docs-search-scrollbar-thumb-height', `${thumbHeight}px`);
  shell.style.setProperty('--docs-search-scrollbar-thumb-offset', `${docsSearchScrollbarTrackInset + thumbOffset}px`);
}

function syncDocsSearchScrollbars() {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll<HTMLElement>('.docs-search__results').forEach(updateDocsSearchScrollbar);
}

function handleDocsSearchScrollbarDrag(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  const scrollbar = event.currentTarget;
  const shell = scrollbar.closest<HTMLElement>('.docs-search__results-shell');
  const results = shell?.querySelector<HTMLElement>('.docs-search__results');

  if (!shell || !results) {
    return;
  }

  const scrollableDistance = results.scrollHeight - results.clientHeight;

  if (scrollableDistance <= 1) {
    return;
  }

  const trackHeight = Math.max(0, results.clientHeight - docsSearchScrollbarTrackInset * 2);
  const thumbHeight = Math.max(
    docsSearchScrollbarMinThumbHeight,
    (results.clientHeight / results.scrollHeight) * trackHeight,
  );
  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);

  if (maxThumbOffset <= 0) {
    return;
  }

  const scrollbarRect = scrollbar.getBoundingClientRect();
  const currentThumbOffset = (results.scrollTop / scrollableDistance) * maxThumbOffset;
  const pointerTarget = event.target as HTMLElement;
  const didGrabThumb = Boolean(pointerTarget.closest('.docs-search-scrollbar__thumb'));
  const grabOffset = didGrabThumb
    ? event.clientY - scrollbarRect.top - docsSearchScrollbarTrackInset - currentThumbOffset
    : thumbHeight / 2;

  const setResultsScrollFromPointer = (clientY: number) => {
    const nextThumbOffset = Math.min(
      maxThumbOffset,
      Math.max(0, clientY - scrollbarRect.top - docsSearchScrollbarTrackInset - grabOffset),
    );

    results.scrollTop = (nextThumbOffset / maxThumbOffset) * scrollableDistance;
    updateDocsSearchScrollbar(results);
  };

  const handlePointerMove = (pointerEvent: PointerEvent) => {
    pointerEvent.preventDefault();
    setResultsScrollFromPointer(pointerEvent.clientY);
  };

  const stopDragging = () => {
    shell.classList.remove('docs-search__results-shell--dragging');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
    window.removeEventListener('pointercancel', stopDragging);
    scrollbar.removeEventListener('lostpointercapture', stopDragging);
  };

  event.preventDefault();
  shell.classList.add('docs-search__results-shell--dragging');
  if (typeof scrollbar.setPointerCapture === 'function') {
    scrollbar.setPointerCapture(event.pointerId);
  }
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
  scrollbar.addEventListener('lostpointercapture', stopDragging);

  if (!didGrabThumb) {
    setResultsScrollFromPointer(event.clientY);
  }
}

function syncDesktopAnchorNavigationScroll(activeAnchorId: string) {
  if (typeof document === 'undefined') {
    return;
  }

  const navigation = document.querySelector<HTMLElement>('.sections-layout__sidebar .section-nav');

  if (!navigation) {
    return;
  }

  const links = Array.from(navigation.querySelectorAll<HTMLElement>('a[data-anchor-id]'));
  let activeLink = links.find((link) => link.dataset.anchorId === activeAnchorId);

  if (!activeLink) {
    for (let index = links.length - 1; index >= 0; index -= 1) {
      const link = links[index];
      const anchorId = link.dataset.anchorId;

      if (anchorId && activeAnchorId.startsWith(`${anchorId}-`)) {
        activeLink = link;
        break;
      }
    }
  }

  if (!activeLink) {
    return;
  }

  const navigationRect = navigation.getBoundingClientRect();
  const activeLinkRect = activeLink.getBoundingClientRect();
  const nextScrollTop =
    navigation.scrollTop +
    activeLinkRect.top -
    navigationRect.top -
    (navigation.clientHeight - activeLink.clientHeight) / 2;

  const clampedScrollTop = Math.max(0, nextScrollTop);
  const scrollTo = navigation.scrollTo;

  if (typeof scrollTo === 'function') {
    scrollTo.call(navigation, { top: clampedScrollTop, behavior: 'smooth' });
    return;
  }

  navigation.scrollTop = clampedScrollTop;
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
    <div className={`docs-search${hasQuery ? ' docs-search--with-results' : ''}`}>
      <label className="docs-search__label" htmlFor={id}>
        Search documentation
      </label>
      <div className="docs-search__field">
        <input
          id={id}
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search..."
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
        {hasQuery ? (
          <button className="docs-search__clear" type="button" onClick={() => onQueryChange('')}>
            Clear
          </button>
        ) : null}
      </div>

      {hasQuery ? (
        <div className="docs-search__results-shell">
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
              </div>
            )}
          </div>
          <span className="docs-search-scrollbar" aria-hidden="true" onPointerDown={handleDocsSearchScrollbarDrag}>
            <span className="docs-search-scrollbar__thumb" />
          </span>
        </div>
      ) : null}
    </div>
  );
}

function PickerGalleryPage({ color, onChange }: { color: RGBAColor; onChange: (color: ColorResult) => void }) {
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
            <h2 id="picker-gallery-title">Find the picker that fits the job.</h2>
            <p>{pickerGalleryIntro}</p>
          </div>
          <div className="gallery-page__note">
            <strong>{pickerMetadata.length} picker exports</strong>
            <span>{pickerGalleryNote}</span>
          </div>
        </div>
      </section>

      <PickerGallery color={color} onChange={onChange} />
    </div>
  );
}

type SitePage = 'docs' | 'gallery' | 'not-found';

function SiteHeader({ page }: { page: SitePage }) {
  const isDocsPage = page === 'docs';
  const isGalleryPage = page === 'gallery';

  return (
    <header className="site-header">
      <Link className="site-header__brand" to="/" aria-label="react-color documentation home">
        <span className="site-header__brand-mark" aria-hidden="true" />
        <span className="site-header__brand-copy">
          <strong>react-color</strong>
          <span>Modern React color pickers</span>
        </span>
      </Link>

      <nav className="site-header__nav" aria-label="Primary navigation">
        <Link
          className={`site-header__link${isDocsPage ? ' site-header__link--active' : ''}`}
          to="/"
          aria-current={isDocsPage ? 'page' : undefined}
        >
          Read the docs
        </Link>
        <Link
          className={`site-header__link${isGalleryPage ? ' site-header__link--active' : ''}`}
          to={galleryPagePath}
          aria-current={isGalleryPage ? 'page' : undefined}
        >
          Picker Gallery
        </Link>
        <a className="site-header__link" href="https://github.com/antonlimar/react-color">
          View repository
        </a>
      </nav>
    </header>
  );
}

function NotFoundMain() {
  return (
    <main className="not-found-page" id="site-not-found">
      <section className="not-found-page__panel" aria-labelledby="not-found-title">
        <div className="not-found-page__copy">
          <p className="eyebrow">404 / Page not found</p>
          <h1 id="not-found-title">This color is outside the palette.</h1>
          <p>
            The page you tried to open is not part of the documentation site. The docs and picker gallery are still one
            click away.
          </p>
        </div>

        <div className="not-found-page__actions" aria-label="404 recovery links">
          <Link className="not-found-page__primary-action" to="/">
            Read the docs
          </Link>
          <Link className="not-found-page__secondary-action" to={galleryPagePath}>
            Open picker gallery
          </Link>
        </div>

        <div className="not-found-page__swatches" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <div className="site-shell" style={formatBackground(initialColor)}>
      <a className="skip-link" href="#site-not-found">
        Skip to 404 message
      </a>
      <div className="site-shell__ambient site-shell__ambient--grid" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--one" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--two" aria-hidden="true" />

      <SiteHeader page="not-found" />
      <NotFoundMain />
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
  const pendingAnchorNavigationRef = useRef<{ id: string; startedAt: number } | null>(null);
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
  const isNotFoundPage = currentPathname !== '/' && !isGalleryPage;
  const anchorNavigationPath = isGalleryPage || isNotFoundPage ? '/' : '';
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
  const handleColorChange = useCallback((nextColor: ColorResult) => {
    setColor(nextColor.rgb);
  }, []);
  const mobileSectionDrawer = (
    <>
      <div className="sections-shell__toolbar">
        <button
          className="sections-shell__drawer-toggle"
          ref={drawerToggleRef}
          type="button"
          aria-label="Browse sections"
          aria-expanded={isNavDrawerOpen}
          aria-controls="mobile-section-nav"
          onClick={() => setIsNavDrawerOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

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
            <strong id="mobile-section-nav-title">Sections</strong>
            <button
              className="sections-shell__drawer-close"
              type="button"
              aria-label="Close section navigation"
              onClick={closeNavDrawer}
            >
              Close
            </button>
          </div>
          {renderAnchorNavigation(
            activeAnchorId,
            closeNavDrawer,
            'section-nav section-nav--drawer',
            anchorNavigationPath,
          )}
        </div>
      </div>
    </>
  );

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
        (window.innerWidth <= 920 ? mobileSearchRef.current : desktopSearchRef.current)?.focus();
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
  }, [searchQuery]);

  useEffect(() => {
    const anchorIds = getAnchorIds();

    if (typeof window === 'undefined') {
      return undefined;
    }

    let animationFrame = 0;

    const updateActiveFromScroll = ({ preferHash = false } = {}) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const hash = window.location.hash.replace('#', '');

        if (preferHash && hash && anchorIds.includes(hash)) {
          setActiveAnchorId(hash);
          return;
        }

        const pendingAnchorNavigation = pendingAnchorNavigationRef.current;

        if (pendingAnchorNavigation) {
          const elapsed = window.performance.now() - pendingAnchorNavigation.startedAt;

          if (elapsed < 1400 && !isAnchorNavigationSettled(pendingAnchorNavigation.id)) {
            setActiveAnchorId(pendingAnchorNavigation.id);
            return;
          }

          pendingAnchorNavigationRef.current = null;
        }

        const nextActiveId = findNearestAnchorId(anchorIds);

        if (nextActiveId) {
          setActiveAnchorId(nextActiveId);
        }
      });
    };

    const handleHashChange = () => {
      cancelAnimationFrame(animationFrame);
      const hash = window.location.hash.replace('#', '');
      if (hash && anchorIds.includes(hash)) {
        pendingAnchorNavigationRef.current = {
          id: hash,
          startedAt: window.performance.now(),
        };
        setActiveAnchorId(hash);
      }
      closeNavDrawer();
    };

    const handleResize = () => {
      if (window.innerWidth > 920) {
        setIsNavDrawerOpen(false);
      }
    };

    const handleScroll = () => {
      updateActiveFromScroll();
    };

    updateActiveFromScroll({ preferHash: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScroll);
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

  useEffect(() => {
    if (searchQuery.trim() || isGalleryPage) {
      return;
    }

    syncDesktopAnchorNavigationScroll(activeAnchorId);
  }, [activeAnchorId, isGalleryPage, searchQuery]);

  useEffect(() => {
    if (isGalleryPage || typeof document === 'undefined') {
      return undefined;
    }

    const navigations = Array.from(document.querySelectorAll<HTMLElement>('.section-nav'));
    const searchResultsPanels = Array.from(document.querySelectorAll<HTMLElement>('.docs-search__results'));
    let animationFrame = 0;

    const scheduleScrollbarSync = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        syncSectionNavigationScrollbars();
        syncDocsSearchScrollbars();
      });
    };

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(scheduleScrollbarSync);

    navigations.forEach((navigation) => {
      navigation.addEventListener('scroll', scheduleScrollbarSync, { passive: true });
      resizeObserver?.observe(navigation);
    });
    searchResultsPanels.forEach((resultsPanel) => {
      resultsPanel.addEventListener('scroll', scheduleScrollbarSync, { passive: true });
      resizeObserver?.observe(resultsPanel);
    });
    window.addEventListener('resize', scheduleScrollbarSync);

    scheduleScrollbarSync();

    return () => {
      cancelAnimationFrame(animationFrame);
      navigations.forEach((navigation) => {
        navigation.removeEventListener('scroll', scheduleScrollbarSync);
      });
      searchResultsPanels.forEach((resultsPanel) => {
        resultsPanel.removeEventListener('scroll', scheduleScrollbarSync);
      });
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleScrollbarSync);
    };
  }, [activeAnchorId, isGalleryPage, isNavDrawerOpen, searchQuery]);

  if (isNotFoundPage) {
    return (
      <div className="site-shell" style={formatBackground(color)}>
        <a className="skip-link" href="#site-not-found">
          Skip to 404 message
        </a>
        <div className="site-shell__ambient site-shell__ambient--grid" aria-hidden="true" />
        <div className="site-shell__ambient site-shell__ambient--one" aria-hidden="true" />
        <div className="site-shell__ambient site-shell__ambient--two" aria-hidden="true" />

        <SiteHeader page="not-found" />
        {mobileSectionDrawer}
        <NotFoundMain />
      </div>
    );
  }

  return (
    <div className="site-shell" style={formatBackground(color)}>
      <a className="skip-link" href="#site-documentation">
        Skip to documentation
      </a>
      <div className="site-shell__ambient site-shell__ambient--grid" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--one" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--two" aria-hidden="true" />

      <SiteHeader page={isGalleryPage ? 'gallery' : 'docs'} />
      {mobileSectionDrawer}

      {isGalleryPage ? null : (
        <>
          <header className="hero">
            <div className="hero__backdrop hero__backdrop--left" aria-hidden="true" />
            <div className="hero__backdrop hero__backdrop--right" aria-hidden="true" />

            <div className="hero__content">
              <h1>React Color</h1>
              <p className="hero__lede">
                A Collection of Color Pickers from Sketch, Photoshop, Chrome, Github, Twitter, Material Design & more
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
                  <p className="hero__demo-copy">Each panel reads and writes the same color value.</p>
                </div>
                <div className="hero__demo-actions">
                  <span className="hero__demo-value">{colorToHex(color)}</span>
                  <Link className="hero__demo-link" to={galleryPagePath}>
                    Show more
                  </Link>
                </div>
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
                      <PickerComponent color={color} onChange={handleColorChange} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </header>
        </>
      )}

      <main className={`sections-shell${isGalleryPage ? ' sections-shell--gallery-page' : ''}`} id="site-documentation">
        {isGalleryPage ? (
          <PickerGalleryPage color={color} onChange={handleColorChange} />
        ) : (
          <>
            <div className="sections-shell__mobile-search">
              <SearchNavigation
                id="mobile-docs-search"
                inputRef={mobileSearchRef}
                query={searchQuery}
                results={searchResults}
                onQueryChange={handleSearchQueryChange}
              />
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
  notFoundComponent: NotFoundPage,
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
