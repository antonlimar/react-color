import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { ChromePicker, CompactPicker, GithubPicker, SketchPicker } from 'react-color';
import type { ColorResult, RGBAColor } from 'react-color';

interface DocsPageProps {
  color: RGBAColor;
  colorHex: string;
  desktopSearch: ReactNode;
  galleryPagePath: string;
  mobileSearch: ReactNode;
  paletteStops: string[];
  rgbaLabel: string;
  sectionNavigation: ReactNode;
  sections: ReactNode;
  onColorChange: (color: ColorResult) => void;
}

const heroPickerCards = [
  {
    id: 'sketch',
    title: 'Sketch',
    description: 'Full controls for hue, alpha, and saved swatches.',
    component: SketchPicker,
  },
  {
    id: 'chrome',
    title: 'Chrome',
    description: 'The classic all-purpose picker for raw color editing.',
    component: ChromePicker,
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'Fast palette selection when you want decisive defaults.',
    component: GithubPicker,
  },
  {
    id: 'compact',
    title: 'Compact',
    description: 'Dense preset mode for quick iteration in tight layouts.',
    component: CompactPicker,
  },
] as const;

export function DocsPage({
  color,
  colorHex,
  desktopSearch,
  galleryPagePath,
  mobileSearch,
  paletteStops,
  rgbaLabel,
  sectionNavigation,
  sections,
  onColorChange,
}: DocsPageProps) {
  return (
    <>
      <header className="hero">
        <div className="hero__backdrop hero__backdrop--left" aria-hidden="true" />
        <div className="hero__backdrop hero__backdrop--right" aria-hidden="true" />

        <div className="hero__content">
          <h1>React Color</h1>
          <p className="hero__lede">
            A Collection of Color Pickers from Sketch, Photoshop, Chrome, Github, Twitter, Material Design & more
          </p>

          <div className="hero__metrics" aria-label="Current shared color values">
            <div className="hero__metric hero__metric--swatch">
              <span className="hero__swatch" style={{ backgroundColor: rgbaLabel }} />
              <div>
                <strong>{colorHex}</strong>
                <span>Current color</span>
              </div>
            </div>
            <div className="hero__metric">
              <strong>{rgbaLabel}</strong>
              <span>RGBA value</span>
            </div>
          </div>

          <div className="hero__palette" aria-label="Current color family">
            <span className="hero__palette-label">Current color scale</span>
            <div className="hero__palette-track">
              {paletteStops.map((stop, index) => (
                <span className="hero__palette-stop" key={`${stop}-${index}`} style={{ backgroundColor: stop }} />
              ))}
            </div>
          </div>
        </div>

        <div className="hero__demo" aria-label="Synchronized live picker demo">
          <div className="hero__demo-head">
            <div>
              <span className="hero__demo-label">Synchronized pickers</span>
              <p className="hero__demo-copy">Each panel reads and writes the same color value.</p>
            </div>
            <div className="hero__demo-actions">
              <span className="hero__demo-value">{colorHex}</span>
              <Link className="hero__demo-link" to={galleryPagePath}>
                Show more
              </Link>
            </div>
          </div>

          <div className="hero__picker-grid">
            {heroPickerCards.map(({ id, title, description, component: PickerComponent }) => (
              <article className={`hero__picker-card hero__picker-card--${id}`} key={id}>
                <div className="hero__picker-meta">
                  <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                  <span className="hero__picker-chip">{title}</span>
                </div>

                <div className="hero__picker-surface">
                  <PickerComponent color={color} onChange={onColorChange} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </header>

      <main className="sections-shell" id="site-documentation">
        <div className="sections-shell__mobile-search">{mobileSearch}</div>

        <div className="sections-layout">
          <aside className="sections-layout__sidebar">
            {desktopSearch}
            {sectionNavigation}
          </aside>

          <div className="sections">{sections}</div>
        </div>
      </main>
    </>
  );
}
