import { Link } from '@tanstack/react-router';

interface NotFoundPageProps {
  galleryPagePath: string;
}

export function NotFoundPage({ galleryPagePath }: NotFoundPageProps) {
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
