import { useState } from 'react';
import { ChromePicker } from 'react-color';
import type { CSSProperties } from 'react';
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

function formatBackground(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const glowAlpha = Math.max(alpha * 0.32, 0.18);

  return {
    '--site-accent': `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`,
    '--site-accent-soft': `rgba(${color.r}, ${color.g}, ${color.b}, ${glowAlpha})`,
  } as CSSProperties;
}

export default function App() {
  const [color, setColor] = useState<RGBAColor>(initialColor);

  return (
    <div className="site-shell" style={formatBackground(color)}>
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">Phase 8 site scaffold</p>
          <h1>react-color gets a standalone site app.</h1>
          <p className="hero__lede">
            This is the new Vite entrypoint for the GitHub Pages site. It already builds against the local library
            source and is ready for the richer content, navigation, and synchronized picker work from the next plan
            items.
          </p>
          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href="#about">
              Explore the scaffold
            </a>
            <a className="hero__button" href="https://github.com/casesandberg/react-color">
              View repository
            </a>
          </div>
        </div>

        <div className="hero__demo">
          <div className="hero__demo-head">
            <span className="hero__demo-label">Local source demo</span>
            <span className="hero__demo-value">
              rgba({color.r}, {color.g}, {color.b}, {color.a ?? 1})
            </span>
          </div>

          <ChromePicker color={color} onChange={(nextColor: ColorResult) => setColor(nextColor.rgb)} />
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
