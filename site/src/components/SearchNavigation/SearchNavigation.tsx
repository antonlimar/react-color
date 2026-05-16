import type { RefObject } from 'react';
import { handleDocsSearchScrollbarDrag } from './utils';
import './SearchNavigation.scss';

type SearchResultKind = 'section' | 'prop' | 'picker' | 'example';

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
