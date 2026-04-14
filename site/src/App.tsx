import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ChromePicker, CompactPicker, GithubPicker, SketchPicker } from 'react-color';
import type { ColorResult, RGBAColor } from 'react-color';
import { siteSections } from './content';
import type { ContentSection, SectionBlock } from './content';

const initialColor: RGBAColor = {
  r: 61,
  g: 145,
  b: 255,
  a: 1,
};

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

function renderBlock(block: SectionBlock) {
  if (block.type === 'text') {
    return <p className="content-text">{block.text}</p>;
  }

  if (block.type === 'bullets') {
    return (
      <ul className="content-list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <figure className="content-code">
      {block.label ? <figcaption>{block.label}</figcaption> : null}
      <pre>
        <code>{block.code}</code>
      </pre>
    </figure>
  );
}

function renderSection(section: ContentSection) {
  return (
    <section className="section" id={section.id} key={section.id}>
      <div className="section__index">
        <span>{String(section.order).padStart(2, '0')}</span>
        <span>{section.id.replace(/-/g, ' ')}</span>
      </div>

      <div className="section__body">
        <h2>{section.title}</h2>
        {section.intro ? <p className="section__intro">{section.intro}</p> : null}
        {section.blocks.map(renderBlock)}

        {section.subsections?.map((subsection) => (
          <div className="section__subsection" id={subsection.id} key={subsection.id}>
            <h3>{subsection.title}</h3>
            {subsection.intro ? <p className="section__intro section__intro--subsection">{subsection.intro}</p> : null}
            {subsection.blocks?.map(renderBlock)}

            {subsection.propertyGroups?.map((group) => (
              <div className="api-group" key={group.title}>
                <div className="api-group__head">
                  <h4>{group.title}</h4>
                  {group.summary ? <p>{group.summary}</p> : null}
                </div>

                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Prop</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.properties.map((property) => (
                      <tr key={`${group.title}-${property.name}`}>
                        <th scope="row">{property.name}</th>
                        <td>{property.type}</td>
                        <td>{property.defaultValue ?? '—'}</td>
                        <td>{property.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
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

      <main className="sections">{siteSections.map(renderSection)}</main>
    </div>
  );
}
