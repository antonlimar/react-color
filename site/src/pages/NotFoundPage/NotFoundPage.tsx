import { Link } from '@tanstack/react-router';
import { siteBem } from '../../utils/siteBem';
import './NotFoundPage.scss';

interface NotFoundPageProps {
  galleryPagePath: string;
}

export function NotFoundPage({ galleryPagePath }: NotFoundPageProps) {
  const b = siteBem('not-found-page');
  const eyebrow = siteBem('eyebrow');

  return (
    <main className={b()} id="site-not-found">
      <section className={b('panel')} aria-labelledby="not-found-title">
        <div className={b('copy')}>
          <p className={eyebrow()}>404 / Page not found</p>
          <h1 id="not-found-title">This color is outside the palette.</h1>
          <p>
            The page you tried to open is not part of the documentation site. The docs and picker gallery are still one
            click away.
          </p>
        </div>
        <div className={b('actions')} aria-label="404 recovery links">
          <Link className={b('primary-action')} to="/">
            Read the docs
          </Link>
          <Link className={b('secondary-action')} to={galleryPagePath}>
            Open picker gallery
          </Link>
        </div>
        <div className={b('swatches')} aria-hidden="true">
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
