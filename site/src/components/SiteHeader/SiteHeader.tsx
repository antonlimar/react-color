import { Link } from '@tanstack/react-router';
import { siteBem } from '../../utils/siteBem';
import './SiteHeader.scss';

type SitePage = 'docs' | 'gallery' | 'not-found';

interface SiteHeaderProps {
  galleryPagePath: string;
  isDarkTheme: boolean;
  page: SitePage;
  onThemeToggle: () => void;
}

export interface ThemeToggleButtonProps {
  className: string;
  iconClassName: (modifier: 'sun' | 'moon') => string;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

export function ThemeToggleButton({ className, iconClassName, isDarkTheme, onThemeToggle }: ThemeToggleButtonProps) {
  const themeLabel = isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      className={className}
      type="button"
      aria-label={themeLabel}
      aria-pressed={isDarkTheme}
      title={themeLabel}
      onClick={onThemeToggle}
    >
      <svg
        className={iconClassName('sun')}
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg
        className={iconClassName('moon')}
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M20.99 12.74A8.5 8.5 0 1 1 11.26 3a6.5 6.5 0 0 0 9.73 9.74Z" />
      </svg>
    </button>
  );
}

export function SiteHeader({ galleryPagePath, isDarkTheme, page, onThemeToggle }: SiteHeaderProps) {
  const isDocsPage = page === 'docs';
  const isGalleryPage = page === 'gallery';
  const b = siteBem('site-header');

  return (
    <header className={b()}>
      <Link className={b('brand')} to="/" aria-label="@antonlimar/react-color documentation home">
        <span className={b('brand-mark')} aria-hidden="true" />
        <span className={b('brand-copy')}>
          <strong>@antonlimar/react-color</strong>
          <span>Modern React color pickers</span>
        </span>
      </Link>
      <nav className={b('nav')} aria-label="Primary navigation">
        <Link className={b('link', { active: isDocsPage })} to="/" aria-current={isDocsPage ? 'page' : undefined}>
          Read the docs
        </Link>
        <Link
          className={b('link', { active: isGalleryPage })}
          to={galleryPagePath}
          aria-current={isGalleryPage ? 'page' : undefined}
        >
          Picker Gallery
        </Link>
        <a className={b('link')} href="https://github.com/antonlimar/react-color">
          View repository
        </a>
        <ThemeToggleButton
          className={b('theme-toggle')}
          iconClassName={(modifier) => b('theme-icon', { [modifier]: true })}
          isDarkTheme={isDarkTheme}
          onThemeToggle={onThemeToggle}
        />
      </nav>
    </header>
  );
}
