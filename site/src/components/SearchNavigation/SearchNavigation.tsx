import type { RefObject } from 'react';
import { siteBem } from '../../utils/siteBem';
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
  const b = siteBem('docs-search');
  const scrollbar = siteBem('docs-search-scrollbar');

  return (
    <div className={b({ 'with-results': hasQuery })}>
      <label className={b('label')} htmlFor={id}>
        Search documentation
      </label>
      <div className={b('field')}>
        <input
          id={id}
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search..."
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
        {hasQuery ? (
          <button className={b('clear')} type="button" onClick={() => onQueryChange('')}>
            Clear
          </button>
        ) : null}
      </div>
      {hasQuery ? (
        <div className={b('results-shell')}>
          <div className={b('results')} aria-live="polite">
            {results.length > 0 ? (
              <ul className={b('result-list')}>
                {results.map((result) => (
                  <li key={result.id}>
                    <a className={b('result')} href={`#${result.anchorId}`} onClick={onNavigate}>
                      <span className={b('result-head')}>
                        <span className={b('result-title')}>{result.title}</span>
                        <span className={b('kind', { [result.kind]: true })}>{result.kind}</span>
                      </span>
                      <span className={b('snippet')}>{result.snippet}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={b('empty')}>
                <strong>No results found</strong>
              </div>
            )}
          </div>
          <span className={scrollbar()} aria-hidden="true" onPointerDown={handleDocsSearchScrollbarDrag}>
            <span className={scrollbar('thumb')} />
          </span>
        </div>
      ) : null}
    </div>
  );
}
