import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ChromePicker, CompactPicker, GithubPicker, SketchPicker } from 'react-color';
import type { ColorResult, RGBAColor } from 'react-color';

const initialColor: RGBAColor = {
  r: 61,
  g: 145,
  b: 255,
  a: 1,
};

const placeholderSections = [
  {
    id: 'about',
    title: 'About',
    text: 'A dedicated Vite-powered site now lives in `site/`, ready for the full Phase 8 content migration and navigation work.',
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    text: 'The app already resolves the local package source directly, so future docs and demos stay aligned with the library implementation.',
  },
  {
    id: 'component-api',
    title: 'Component API',
    text: 'This scaffold reserves the data-driven API section that will be layered in next, without coupling it to the package build.',
  },
  {
    id: 'create-your-own',
    title: 'Create Your Own',
    text: 'The layout leaves room for custom picker guides and richer interactive examples while keeping site styling fully isolated under `site/`.',
  },
] as const;

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

function formatBackground(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const glowAlpha = Math.max(alpha * 0.32, 0.18);
  const washAlpha = Math.max(alpha * 0.12, 0.08);

  return {
    '--site-accent': `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`,
    '--site-accent-soft': `rgba(${color.r}, ${color.g}, ${color.b}, ${glowAlpha})`,
    '--site-accent-wash': `rgba(${color.r}, ${color.g}, ${color.b}, ${washAlpha})`,
  } as CSSProperties;
}

function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function colorToHex(color: RGBAColor) {
  const toHex = (value: number) => clampColorChannel(value).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
}

export default function App() {
  const [color, setColor] = useState<RGBAColor>(initialColor);
  const alpha = color.a ?? 1;
  const rgbaLabel = `rgba(${clampColorChannel(color.r)}, ${clampColorChannel(color.g)}, ${clampColorChannel(color.b)}, ${alpha.toFixed(2)})`;

  return (
    <div className="site-shell" style={formatBackground(color)}>
      <header className="hero">
        <div className="hero__backdrop hero__backdrop--left" aria-hidden="true" />
        <div className="hero__backdrop hero__backdrop--right" aria-hidden="true" />

        <div className="hero__content">
          <p className="eyebrow">Phase 8 hero live pickers</p>
          <h1>One shared color state, rendered through real pickers.</h1>
          <p className="hero__lede">
            The new site hero now behaves like a live control surface: change the color in any visible picker and the
            whole composition updates in sync, from the section atmosphere to every other picker panel.
          </p>

          <div className="hero__metrics" aria-label="Current shared color values">
            <div className="hero__metric hero__metric--swatch">
              <span className="hero__swatch" style={{ backgroundColor: rgbaLabel }} />
              <div>
                <strong>{colorToHex(color)}</strong>
                <span>Shared theme color</span>
              </div>
            </div>
            <div className="hero__metric">
              <strong>{rgbaLabel}</strong>
              <span>Live RGBA state</span>
            </div>
            <div className="hero__metric">
              <strong>{heroPickerCards.length} synced demos</strong>
              <span>Visible pickers</span>
            </div>
          </div>

          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href="#about">
              Explore the docs shell
            </a>
            <a className="hero__button" href="https://github.com/casesandberg/react-color">
              View repository
            </a>
          </div>
        </div>

        <div className="hero__demo" aria-label="Synchronized live picker demo">
          <div className="hero__demo-head">
            <div>
              <span className="hero__demo-label">Synchronized live pickers</span>
              <p className="hero__demo-copy">Every visible panel reads and writes the same source of truth.</p>
            </div>
            <span className="hero__demo-value">{colorToHex(color)}</span>
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
                  <PickerComponent color={color} onChange={(nextColor: ColorResult) => setColor(nextColor.rgb)} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </header>

      <main className="sections">
        {placeholderSections.map((section) => (
          <section className="section" id={section.id} key={section.id}>
            <div className="section__index">{section.id}</div>
            <div className="section__body">
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
