import { Link } from '@tanstack/react-router';
import { siteBem } from '../../utils/siteBem';
import './SiteHeader.scss';

type SitePage = 'docs' | 'gallery' | 'not-found';

interface SiteHeaderProps {
  galleryPagePath: string;
  page: SitePage;
}

export function SiteHeader({ galleryPagePath, page }: SiteHeaderProps) {
  const isDocsPage = page === 'docs';
  const isGalleryPage = page === 'gallery';
  const b = siteBem('site-header');

  return (
    <header className={b()}>
      <Link className={b('brand')} to="/" aria-label="react-color documentation home">
        <span className={b('brand-mark')} aria-hidden="true" />
        <span className={b('brand-copy')}>
          <strong>react-color</strong>
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
      </nav>
    </header>
  );
}
