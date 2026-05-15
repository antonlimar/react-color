import { Link } from '@tanstack/react-router';
import './SiteHeader.scss';

export type SitePage = 'docs' | 'gallery' | 'not-found';

interface SiteHeaderProps {
  galleryPagePath: string;
  page: SitePage;
}

export function SiteHeader({ galleryPagePath, page }: SiteHeaderProps) {
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
