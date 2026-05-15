import { RouterProvider, createRootRoute, createRoute, createRouter, useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MobileSectionDrawer,
  PickerGallery,
  SearchNavigation,
  SectionNavigation,
  SiteHeader,
  clampColorChannel,
  colorToHex,
  createPaletteStops,
  createPropertyAnchorId,
  createPropertyGroupAnchorId,
  formatBackground,
  getPropertyAnchorId,
  getPropertyGroupAnchorId,
  getSearchableBlockText,
  initialColor,
  packageManagers,
  renderSection,
  stripSearchText,
  syncDesktopAnchorNavigationScroll,
  syncDocsSearchScrollbars,
  syncSectionNavigationScrollbars,
} from './components';
import { pickerMetadata, siteSections } from './content';
import { DocsPage, NotFoundPage as NotFoundPageContent, PickerGalleryPage } from './pages';
import type { SearchIndexEntry, SearchResult } from './components';
import type { PackageManager, SectionBlock } from './content';
import type { ColorResult, RGBAColor } from 'react-color';

const packageManagerStorageKey = 'react-color-docs-package-manager';
const galleryPagePath = '/gallery' as const;

const pickerGalleryIntro =
  'Use this gallery to compare the bundled picker layouts side by side: full editors for precise input, palette pickers for presets, and sliders for focused hue or alpha controls.';

const pickerGalleryNote =
  'Every card shows the named package import and links to the picker-specific props, so you can copy the component shape without digging through the API reference.';

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

function StaticNotFoundPage() {
  return (
    <div className="site-shell" style={formatBackground(initialColor)}>
      <a className="skip-link" href="#site-not-found">
        Skip to 404 message
      </a>
      <div className="site-shell__ambient site-shell__ambient--grid" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--one" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--two" aria-hidden="true" />

      <SiteHeader galleryPagePath={galleryPagePath} page="not-found" />
      <NotFoundPageContent galleryPagePath={galleryPagePath} />
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
    <MobileSectionDrawer
      activeAnchorId={activeAnchorId}
      anchorNavigationPath={anchorNavigationPath}
      drawerPanelRef={drawerPanelRef}
      drawerToggleRef={drawerToggleRef}
      isOpen={isNavDrawerOpen}
      onClose={closeNavDrawer}
      onToggle={() => setIsNavDrawerOpen((current) => !current)}
    />
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

        <SiteHeader galleryPagePath={galleryPagePath} page="not-found" />
        {mobileSectionDrawer}
        <NotFoundPageContent galleryPagePath={galleryPagePath} />
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

      <SiteHeader galleryPagePath={galleryPagePath} page={isGalleryPage ? 'gallery' : 'docs'} />
      {mobileSectionDrawer}

      {isGalleryPage ? (
        <PickerGalleryPage
          gallery={<PickerGallery color={color} onChange={handleColorChange} />}
          galleryNote={pickerGalleryNote}
          intro={pickerGalleryIntro}
          pickerCount={pickerMetadata.length}
        />
      ) : (
        <DocsPage
          color={color}
          colorHex={colorToHex(color)}
          desktopSearch={
            <SearchNavigation
              id="desktop-docs-search"
              inputRef={desktopSearchRef}
              query={searchQuery}
              results={searchResults}
              onQueryChange={handleSearchQueryChange}
            />
          }
          galleryPagePath={galleryPagePath}
          mobileSearch={
            <SearchNavigation
              id="mobile-docs-search"
              inputRef={mobileSearchRef}
              query={searchQuery}
              results={searchResults}
              onQueryChange={handleSearchQueryChange}
            />
          }
          paletteStops={paletteStops}
          rgbaLabel={rgbaLabel}
          sectionNavigation={searchQuery.trim() ? null : <SectionNavigation activeAnchorId={activeAnchorId} />}
          sections={siteSections.map((section) => renderSection(section, { packageManager, setPackageManager }))}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  );
}

function EmptyRoute() {
  return null;
}

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: StaticNotFoundPage,
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
