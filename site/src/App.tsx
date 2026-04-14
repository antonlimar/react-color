import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ChromePicker, CompactPicker, GithubPicker, SketchPicker } from 'react-color';
import type { ColorResult, RGBAColor } from 'react-color';
import { siteSections } from './content';
import type { ContentSection, ContentSubsection, SectionBlock } from './content';

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

function createPaletteStops(color: RGBAColor) {
  const alpha = color.a ?? 1;
  const offsets = [120, 48, -18, -80];

  return offsets.map((offset, index) => {
    const mix = index < 2 ? 0.28 : 0.16;
    const target = index < 2 ? 255 : 12;

    const channel = (value: number) => clampColorChannel(value + (target - value) * mix + offset * 0.08);

    return `rgba(${channel(color.r)}, ${channel(color.g)}, ${channel(color.b)}, ${Math.max(alpha * 0.92, 0.84)})`;
  });
}

function createNavItems(section: ContentSection) {
  return {
    id: section.id,
    title: section.title,
    subsections: section.subsections ?? [],
  };
}

function isSubsectionActive(subsection: ContentSubsection, activeAnchorId: string) {
  return subsection.id === activeAnchorId;
}

function renderBlock(block: SectionBlock, index: number) {
  if (block.type === 'text') {
    return (
      <p className="content-text" key={`text-${index}`}>
        {block.text}
      </p>
    );
  }

  if (block.type === 'bullets') {
    return (
      <ul className="content-list" key={`bullets-${index}`}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <figure className="content-code" key={`code-${index}-${block.label ?? 'snippet'}`}>
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

      <div className="section__panel">
        <div className="section__body">
          <h2>{section.title}</h2>
          {section.intro ? <p className="section__intro">{section.intro}</p> : null}
          {section.blocks.map(renderBlock)}

          {section.subsections?.map((subsection) => (
            <div className="section__subsection" id={subsection.id} key={subsection.id}>
              <h3>{subsection.title}</h3>
              {subsection.intro ? (
                <p className="section__intro section__intro--subsection">{subsection.intro}</p>
              ) : null}
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
      </div>
    </section>
  );
}

function renderAnchorNavigation(activeAnchorId: string, onNavigate?: () => void, className = 'section-nav') {
  const navSections = siteSections.map(createNavItems);

  return (
    <nav className={className} aria-label="Section navigation">
      <div className="section-nav__eyebrow">Jump to section</div>
      <ul className="section-nav__list">
        {navSections.map((section) => {
          const isSectionActive =
            activeAnchorId === section.id || section.subsections.some((subsection) => subsection.id === activeAnchorId);

          return (
            <li className="section-nav__item" key={section.id}>
              <a
                className={`section-nav__link${isSectionActive ? ' section-nav__link--active' : ''}`}
                href={`#${section.id}`}
                aria-current={activeAnchorId === section.id ? 'location' : undefined}
                onClick={onNavigate}
              >
                <span className="section-nav__index">
                  {String(siteSections.findIndex((entry) => entry.id === section.id) + 2).padStart(2, '0')}
                </span>
                <span>{section.title}</span>
              </a>

              {section.subsections.length > 0 ? (
                <ul className="section-nav__sublist">
                  {section.subsections.map((subsection) => (
                    <li key={subsection.id}>
                      <a
                        className={`section-nav__sublink${
                          isSubsectionActive(subsection, activeAnchorId) ? ' section-nav__sublink--active' : ''
                        }`}
                        href={`#${subsection.id}`}
                        aria-current={activeAnchorId === subsection.id ? 'location' : undefined}
                        onClick={onNavigate}
                      >
                        {subsection.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function App() {
  const [color, setColor] = useState<RGBAColor>(initialColor);
  const [activeAnchorId, setActiveAnchorId] = useState<string>(() => {
    const defaultId = siteSections[0]?.id ?? 'about';

    if (typeof window === 'undefined') {
      return defaultId;
    }

    const hash = window.location.hash.replace('#', '');
    const anchorIds = siteSections.flatMap((section) => [
      section.id,
      ...(section.subsections?.map((subsection) => subsection.id) ?? []),
    ]);

    return hash && anchorIds.includes(hash) ? hash : defaultId;
  });
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const alpha = color.a ?? 1;
  const rgbaLabel = `rgba(${clampColorChannel(color.r)}, ${clampColorChannel(color.g)}, ${clampColorChannel(color.b)}, ${alpha.toFixed(2)})`;
  const paletteStops = createPaletteStops(color);

  useEffect(() => {
    const anchorIds = siteSections.flatMap((section) => [
      section.id,
      ...(section.subsections?.map((subsection) => subsection.id) ?? []),
    ]);

    if (typeof window === 'undefined') {
      return undefined;
    }

    const observedElements = anchorIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (observedElements.length === 0) {
      return undefined;
    }

    const visibleEntries = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleEntries.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleEntries.delete(entry.target.id);
          }
        });

        const nextActiveId = Array.from(visibleEntries.entries()).sort((left, right) => right[1] - left[1])[0]?.[0];

        if (nextActiveId) {
          setActiveAnchorId(nextActiveId);
        }
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.15, 0.35, 0.55, 0.75],
      },
    );

    observedElements.forEach((element) => observer.observe(element));

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && anchorIds.includes(hash)) {
        setActiveAnchorId(hash);
      }
      setIsNavDrawerOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth > 920) {
        setIsNavDrawerOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="site-shell" style={formatBackground(color)}>
      <div className="site-shell__ambient site-shell__ambient--grid" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--one" aria-hidden="true" />
      <div className="site-shell__ambient site-shell__ambient--two" aria-hidden="true" />

      <header className="hero">
        <div className="hero__backdrop hero__backdrop--left" aria-hidden="true" />
        <div className="hero__backdrop hero__backdrop--right" aria-hidden="true" />

        <div className="hero__content">
          <div className="hero__masthead">
            <div className="hero__brand">
              <span className="hero__brand-mark" aria-hidden="true" />
              <div className="hero__brand-copy">
                <strong>react-color</strong>
                <span>GitHub Pages site system</span>
              </div>
            </div>
            <span className="hero__status">Visual design system</span>
          </div>

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
            <a className="hero__button" href="https://github.com/antonlimar/react-color">
              View repository
            </a>
          </div>

          <div className="hero__palette" aria-label="Current color family">
            <span className="hero__palette-label">Adaptive palette rail</span>
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

      <main className="sections-shell">
        <section className="sections-shell__intro" aria-label="Site design system summary">
          <div className="sections-shell__intro-copy">
            <p className="eyebrow">Site-only styling layer</p>
            <h2>Typography, spacing, surfaces, and navigation now speak the same design language.</h2>
          </div>
          <div className="sections-shell__intro-card">
            <strong>Isolated in `site/`</strong>
            <span>Custom properties, layout rules, and decorative treatments live entirely in the site app.</span>
          </div>
        </section>

        <div className="sections-shell__toolbar">
          <button
            className="sections-shell__drawer-toggle"
            type="button"
            aria-expanded={isNavDrawerOpen}
            aria-controls="mobile-section-nav"
            onClick={() => setIsNavDrawerOpen((current) => !current)}
          >
            <span>Browse sections</span>
            <span className="sections-shell__drawer-meta">
              {siteSections.find((section) => section.id === activeAnchorId)?.title ??
                siteSections.find((section) =>
                  section.subsections?.some((subsection) => subsection.id === activeAnchorId),
                )?.title ??
                'Navigation'}
            </span>
          </button>
        </div>

        <div className="sections-layout">
          <aside className="sections-layout__sidebar">{renderAnchorNavigation(activeAnchorId)}</aside>

          <div
            className={`sections-shell__drawer${isNavDrawerOpen ? ' sections-shell__drawer--open' : ''}`}
            hidden={!isNavDrawerOpen}
          >
            <button
              className="sections-shell__drawer-backdrop"
              type="button"
              aria-label="Close section navigation"
              onClick={() => setIsNavDrawerOpen(false)}
            />
            <div className="sections-shell__drawer-panel" id="mobile-section-nav">
              <div className="sections-shell__drawer-head">
                <div>
                  <p className="sections-shell__drawer-eyebrow">Mobile navigation</p>
                  <strong>Docs anchors</strong>
                </div>
                <button
                  className="sections-shell__drawer-close"
                  type="button"
                  aria-label="Close section navigation"
                  onClick={() => setIsNavDrawerOpen(false)}
                >
                  Close
                </button>
              </div>
              {renderAnchorNavigation(
                activeAnchorId,
                () => setIsNavDrawerOpen(false),
                'section-nav section-nav--drawer',
              )}
            </div>
          </div>

          <div className="sections">{siteSections.map(renderSection)}</div>
        </div>
      </main>
    </div>
  );
}
