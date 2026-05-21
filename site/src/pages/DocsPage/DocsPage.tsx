import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { ChromePicker, CompactPicker, GithubPicker, SketchPicker } from '@antonlimar/react-color';
import type { ColorResult, PickerTheme, RGBAColor } from '@antonlimar/react-color';
import { siteBem } from '../../utils';
import './DocsPage.scss';

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
  theme: PickerTheme;
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
  theme,
  onColorChange,
}: DocsPageProps) {
  const hero = siteBem('hero');
  const sectionsShell = siteBem('sections-shell');
  const sectionsLayout = siteBem('sections-layout');
  const sectionsBlock = siteBem('sections');

  return (
    <>
      <header className={hero()}>
        <div className={hero('backdrop', { left: true })} aria-hidden="true" />
        <div className={hero('backdrop', { right: true })} aria-hidden="true" />
        <div className={hero('content')}>
          <h1>React Color</h1>
          <p className={hero('lede')}>
            A Collection of Color Pickers from Sketch, Photoshop, Chrome, Github, Twitter, Material Design & more
          </p>
          <div className={hero('metrics')} aria-label="Current shared color values">
            <div className={hero('metric', { swatch: true })}>
              <span className={hero('swatch')} style={{ backgroundColor: rgbaLabel }} />
              <div>
                <strong>{colorHex}</strong>
                <span>Current color</span>
              </div>
            </div>
            <div className={hero('metric')}>
              <strong>{rgbaLabel}</strong>
              <span>RGBA value</span>
            </div>
          </div>
          <div className={hero('palette')} aria-label="Current color family">
            <span className={hero('palette-label')}>Current color scale</span>
            <div className={hero('palette-track')}>
              {paletteStops.map((stop, index) => (
                <span className={hero('palette-stop')} key={`${stop}-${index}`} style={{ backgroundColor: stop }} />
              ))}
            </div>
          </div>
        </div>
        <div className={hero('demo')} aria-label="Synchronized live picker demo">
          <div className={hero('demo-head')}>
            <div>
              <span className={hero('demo-label')}>Synchronized pickers</span>
              <p className={hero('demo-copy')}>Each panel reads and writes the same color value.</p>
            </div>
            <div className={hero('demo-actions')}>
              <span className={hero('demo-value')}>{colorHex}</span>
              <Link className={hero('demo-link')} to={galleryPagePath}>
                Show more
              </Link>
            </div>
          </div>
          <div className={hero('picker-grid')}>
            {heroPickerCards.map(({ id, title, description, component: PickerComponent }) => (
              <article className={hero('picker-card', { [id]: true })} key={id}>
                <div className={hero('picker-meta')}>
                  <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                  <span className={hero('picker-chip')}>{title}</span>
                </div>
                <div className={hero('picker-surface')}>
                  <PickerComponent color={color} theme={theme} onChange={onColorChange} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </header>
      <main className={sectionsShell()} id="site-documentation">
        <div className={sectionsShell('mobile-search')}>{mobileSearch}</div>
        <div className={sectionsLayout()}>
          <aside className={sectionsLayout('sidebar')}>
            {desktopSearch}
            {sectionNavigation}
          </aside>
          <div className={sectionsBlock()}>{sections}</div>
        </div>
      </main>
    </>
  );
}
