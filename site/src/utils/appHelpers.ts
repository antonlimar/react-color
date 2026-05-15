import {
  createPropertyAnchorId,
  createPropertyGroupAnchorId,
  getPropertyAnchorId,
  getPropertyGroupAnchorId,
  getSearchableBlockText,
  packageManagers,
  stripSearchText,
} from '../components';
import { pickerMetadata, siteSections } from '../content';
import type { SearchIndexEntry, SearchResult } from '../components';
import type { PackageManager, SectionBlock } from '../content';

export const packageManagerStorageKey = 'react-color-docs-package-manager';

export function normalizeRouterBasepath(baseUrl: string) {
  if (!baseUrl || baseUrl === '/') {
    return '/';
  }

  return `/${baseUrl.replace(/^\/+|\/+$/g, '')}`;
}

export function isPackageManager(value: string | null): value is PackageManager {
  return packageManagers.includes(value as PackageManager);
}

export function getInitialPackageManager(): PackageManager {
  if (typeof window === 'undefined') {
    return 'npm';
  }

  const savedManager = window.localStorage.getItem(packageManagerStorageKey);

  return isPackageManager(savedManager) ? savedManager : 'npm';
}

export function getAnchorIds() {
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

export function createSearchIndex(): SearchIndexEntry[] {
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

      subsection.blocks?.forEach((block: SectionBlock, blockIndex) => {
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

export function getInitialSearchQuery() {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get('q') ?? '';
}

export function createSearchSnippet(content: string, query: string) {
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

export function searchDocs(query: string): SearchResult[] {
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

export function isTextEntryTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
}

export function findNearestAnchorId(anchorIds: string[]) {
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

export function isAnchorNavigationSettled(anchorId: string) {
  const element = document.getElementById(anchorId);

  if (!element) {
    return true;
  }

  const rect = element.getBoundingClientRect();
  const settledLine = Math.min(180, window.innerHeight * 0.3);

  return rect.top >= 0 && rect.top <= settledLine;
}
