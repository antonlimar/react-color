import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

export type SearchResultKind = 'section' | 'prop' | 'picker' | 'example';

export interface SearchIndexEntry {
  id: string;
  anchorId: string;
  title: string;
  kind: SearchResultKind;
  content: string;
}

export interface SearchResult extends SearchIndexEntry {
  snippet: string;
}

interface SearchNavigationProps {
  id: string;
  query: string;
  results: SearchResult[];
  inputRef?: RefObject<HTMLInputElement | null>;
  onQueryChange: (query: string) => void;
  onNavigate?: () => void;
}

const docsSearchScrollbarTrackInset = 8;
const docsSearchScrollbarMinThumbHeight = 44;

export function updateDocsSearchScrollbar(results: HTMLElement) {
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

export function syncDocsSearchScrollbars() {
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

export function SearchNavigation({ id, query, results, inputRef, onQueryChange, onNavigate }: SearchNavigationProps) {
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
