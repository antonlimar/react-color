import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import siteHtml from '../index.html?raw';
import App from './App';

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
}

function clickAnchorWithoutNavigation(anchor: HTMLElement) {
  const preventNavigation = (event: MouseEvent) => event.preventDefault();

  anchor.addEventListener('click', preventNavigation);
  fireEvent.click(anchor);
  anchor.removeEventListener('click', preventNavigation);
}

describe('site app', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
    window.location.hash = '';
    setViewportWidth(768);
  });

  test('keeps the hero state synchronized when a picker changes color', async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      expect(container.querySelector('.site-shell')).toBeInstanceOf(HTMLElement);
    });

    const siteShell = container.querySelector('.site-shell') as HTMLElement;
    const githubSwatch = container.querySelector('.hero__picker-card--github [tabindex="0"]');
    const heroDemoValue = container.querySelector('.hero__demo-value');
    const heroDemo = container.querySelector('.hero__demo') as HTMLElement;

    expect(siteShell).toHaveStyle('--site-accent: rgba(61, 145, 255, 1)');
    expect(siteShell).toHaveStyle('--site-accent-page: rgba(61, 145, 255, 0.18)');
    expect(siteShell).toHaveStyle('--site-accent-floor: rgba(61, 145, 255, 0.42)');
    expect(githubSwatch).toBeInstanceOf(HTMLElement);
    expect(heroDemoValue).toHaveTextContent('#3D91FF');
    expect(within(heroDemo).getByRole('link', { name: 'Show more' })).toHaveAttribute('href', '/gallery');

    fireEvent.click(githubSwatch as HTMLElement);

    expect(heroDemoValue).not.toHaveTextContent('#3D91FF');
    expect(siteShell?.getAttribute('style')).not.toContain('rgba(61, 145, 255, 1)');
    expect(siteShell?.getAttribute('style')).not.toContain('rgba(61, 145, 255, 0.18)');
    expect(siteShell?.getAttribute('style')).not.toContain('rgba(61, 145, 255, 0.42)');
  });

  test('updates active anchors from the hash and closes the mobile drawer on navigation', async () => {
    const { container } = render(<App />);
    const drawerToggle = screen.getByRole('button', { name: /browse sections/i });

    fireEvent.click(drawerToggle);

    const drawerNav = container.querySelector('.section-nav--drawer');
    expect(drawerToggle).toHaveAttribute('aria-expanded', 'true');
    expect(drawerNav?.closest('.sections-shell__drawer')).not.toHaveAttribute('hidden');

    await act(async () => {
      window.location.hash = '#install';
      window.dispatchEvent(new Event('hashchange'));
    });

    await waitFor(() => {
      const installLinks = screen.getAllByRole('link', { name: 'Install' });
      expect(installLinks.some((link) => link.getAttribute('aria-current') === 'location')).toBe(true);
    });

    fireEvent.click(drawerToggle);
    expect(drawerToggle).toHaveAttribute('aria-expanded', 'true');

    const drawerInstallLink = within(drawerNav as HTMLElement).getByRole('link', { name: 'Install', hidden: true });
    clickAnchorWithoutNavigation(drawerInstallLink);

    expect(drawerToggle).toHaveAttribute('aria-expanded', 'false');
    expect(drawerNav?.closest('.sections-shell__drawer')).toHaveAttribute('hidden');
  });

  test('renders favicon link and skip link to the documentation main landmark', () => {
    const { container } = render(<App />);
    const skipLink = screen.getByRole('link', { name: /skip to documentation/i });
    const primaryNav = screen.getByRole('navigation', { name: /primary navigation/i });

    expect(siteHtml).toContain('<link rel="icon" href="/src/assets/favicon.ico" sizes="16x16" />');
    expect(skipLink).toHaveAttribute('href', '#site-documentation');
    expect(container.querySelector('main#site-documentation')).toBeInstanceOf(HTMLElement);
    expect(within(primaryNav).getByRole('link', { name: 'Read the docs' })).toHaveAttribute('href', '/');
    expect(within(primaryNav).getByRole('link', { name: 'Picker Gallery' })).toHaveAttribute('href', '/gallery');
    expect(within(primaryNav).getByRole('link', { name: 'View repository' })).toHaveAttribute(
      'href',
      'https://github.com/antonlimar/react-color',
    );
  });

  test('copies section anchors when documentation headings are clicked', () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<App />);

    const installHeading = screen.getByRole('heading', { name: 'Install' });
    const installAnchor = within(installHeading).getByRole('link', { name: 'Install' });

    expect(installAnchor).toHaveAttribute('href', '#install');
    expect(installAnchor.querySelector('.anchor-heading__icon svg')).toBeInstanceOf(SVGElement);

    clickAnchorWithoutNavigation(installAnchor);

    expect(writeText).toHaveBeenCalledWith('#install');
  });

  test('closes the mobile drawer with Escape, restores focus, and unlocks body scrolling', async () => {
    render(<App />);
    const drawerToggle = screen.getByRole('button', { name: /browse sections/i });

    fireEvent.click(drawerToggle);

    const drawer = screen.getByRole('dialog', { name: /docs anchors/i });
    expect(drawerToggle).toHaveAttribute('aria-expanded', 'true');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    await waitFor(() => {
      expect(drawerToggle).toHaveAttribute('aria-expanded', 'false');
      expect(document.body.style.overflow).toBe('');
      expect(drawerToggle).toHaveFocus();
    });
  });

  test('renders documentation examples as highlighted TypeScript snippets', () => {
    const { container } = render(<App />);
    const inlineUsageCaption = screen.getByText('Inline usage');
    const codeFigure = inlineUsageCaption.closest('.content-code');
    const codeElement = codeFigure?.querySelector('code');

    expect(codeElement).toHaveClass('language-tsx');
    expect(codeElement?.innerHTML).toContain('token keyword');
    expect(codeElement).toHaveTextContent("import { SketchPicker } from 'react-color';");
    expect(container).not.toHaveTextContent("import React from 'react';");
  });

  test('copies code snippets, updates button state, and announces the clipboard status', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<App />);
    const inlineUsageCaption = screen.getByText('Inline usage');
    const codeFigure = inlineUsageCaption.closest('.content-code') as HTMLElement;
    const copyButton = within(codeFigure).getByRole('button', { name: /copy: inline usage/i });

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        'import { SketchPicker } from \'react-color\';\n\nexport function Example() {\n  return <SketchPicker theme="auto" />;\n}\n',
      );
      expect(copyButton).toHaveTextContent('Copied');
      expect(within(codeFigure).getByText('Code copied to clipboard.')).toHaveAttribute('aria-live', 'polite');
    });
  });

  test('shows retry state when code copy fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });

    render(<App />);
    const inlineUsageCaption = screen.getByText('Inline usage');
    const codeFigure = inlineUsageCaption.closest('.content-code') as HTMLElement;
    const copyButton = within(codeFigure).getByRole('button', { name: /copy: inline usage/i });

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(copyButton).toHaveTextContent('Retry Copy');
      expect(within(codeFigure).getByText('Copy failed. Try again.')).toHaveAttribute('aria-live', 'polite');
    });
  });

  test('switches package-manager tabs and persists the selected install command', () => {
    const { unmount } = render(<App />);
    const installCaption = screen.getByText('Install package');
    const installFigure = installCaption.closest('.content-code') as HTMLElement;
    const yarnTab = within(installFigure).getByRole('tab', { name: 'yarn' });

    expect(within(installFigure).getByRole('tab', { name: 'npm' })).toHaveAttribute('aria-selected', 'true');
    expect(installFigure.querySelector('code')).toHaveTextContent('npm install react-color --save');

    fireEvent.click(yarnTab);

    expect(yarnTab).toHaveAttribute('aria-selected', 'true');
    expect(window.localStorage.getItem('react-color-docs-package-manager')).toBe('yarn');
    expect(installFigure.querySelector('code')).toHaveTextContent('yarn add react-color');

    unmount();
    render(<App />);

    const persistedInstallFigure = screen.getByText('Install package').closest('.content-code') as HTMLElement;
    expect(within(persistedInstallFigure).getByRole('tab', { name: 'yarn' })).toHaveAttribute('aria-selected', 'true');
    expect(persistedInstallFigure.querySelector('code')).toHaveTextContent('yarn add react-color');
  });

  test('highlights JSX inside tsx return statements', () => {
    render(<App />);
    const liveUpdatesCaption = screen.getByText('Live updates during interaction');
    const codeFigure = liveUpdatesCaption.closest('.content-code');
    const codeElement = codeFigure?.querySelector('code');

    expect(codeElement?.innerHTML).toContain('token tag');
    expect(codeElement?.innerHTML).toContain('SwatchesPicker');
    expect(codeElement?.innerHTML).toContain('token attr-name');
  });

  test('renders backtick-wrapped inline content as code in prose sections', () => {
    const { container } = render(<App />);
    const section = container.querySelector('#color');
    const introParagraph = section?.querySelector('.section__intro');
    const acceptedValuesParagraph = section?.querySelector('.content-text');

    const inlineCode = within(introParagraph as HTMLElement).getByText('color');
    expect(inlineCode.tagName).toBe('CODE');

    const transparentInlineCode = within(acceptedValuesParagraph as HTMLElement).getByText('transparent');
    expect(transparentInlineCode.tagName).toBe('CODE');
  });

  test('renders the original project reference as an external link', () => {
    render(<App />);
    const [originalProjectLink] = screen.getAllByRole('link', { name: 'casesandberg/react-color' });

    expect(originalProjectLink).toHaveAttribute('href', 'https://github.com/casesandberg/react-color');
    expect(originalProjectLink).toHaveAttribute('target', '_blank');
    expect(screen.getAllByText(/actively maintained fork/i)).toHaveLength(1);
  });

  test('renders an acknowledgement section after Create Your Own and in navigation', () => {
    const { container } = render(<App />);
    const sidebar = container.querySelector('.sections-layout__sidebar') as HTMLElement;
    const createYourOwn = container.querySelector('#create-your-own') as HTMLElement;
    const acknowledgement = container.querySelector('#acknowledgement') as HTMLElement;

    expect(screen.getByRole('heading', { name: 'Acknowledgement' })).toBeInTheDocument();
    expect(within(sidebar).getByRole('link', { name: /Acknowledgement/ })).toHaveAttribute('href', '#acknowledgement');
    expect(screen.getAllByRole('link', { name: 'casesandberg/react-color' })).toHaveLength(2);
    expect(screen.getByText(/made this continuation possible/i)).toBeInTheDocument();
    expect(createYourOwn.compareDocumentPosition(acknowledgement) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  test('renders the developer guides section with migration, TypeScript, styling, SSR, and accessibility notes', () => {
    const { container } = render(<App />);
    const developerGuides = container.querySelector('#developer-guides');

    expect(developerGuides).toBeInstanceOf(HTMLElement);
    expect(
      within(developerGuides as HTMLElement).getByRole('heading', { name: 'Developer Guides' }),
    ).toBeInTheDocument();
    expect(
      within(developerGuides as HTMLElement).getByRole('heading', { name: 'Migration from casesandberg/react-color' }),
    ).toBeInTheDocument();
    expect(
      within(developerGuides as HTMLElement).getByRole('heading', { name: 'TypeScript Recipes' }),
    ).toBeInTheDocument();
    expect(
      within(developerGuides as HTMLElement).getByRole('heading', { name: 'Styling & CSS Hooks' }),
    ).toBeInTheDocument();
    expect(
      within(developerGuides as HTMLElement).getByRole('heading', { name: 'SSR & Framework Notes' }),
    ).toBeInTheDocument();
    expect(
      within(developerGuides as HTMLElement).getByRole('heading', { name: 'Accessibility Notes' }),
    ).toBeInTheDocument();
    expect(within(developerGuides as HTMLElement).getByText('Typing custom picker props')).toBeInTheDocument();
    expect(within(developerGuides as HTMLElement).getByText('CustomPickerInjectedProps')).toBeInTheDocument();
  });

  test('adds picker-specific prop groups as nested navigation anchors', () => {
    const { container } = render(<App />);
    const sidebar = container.querySelector('.sections-layout__sidebar');
    const pickerPropsLink = within(sidebar as HTMLElement).getByRole('link', { name: 'Picker-Specific Props' });
    const pickerPropsItem = pickerPropsLink.closest('li');
    const nestedList = pickerPropsItem?.querySelector('.section-nav__childlist');

    expect(pickerPropsLink).toHaveAttribute('href', '#picker-specific-props');
    expect(nestedList).toBeInstanceOf(HTMLElement);

    const alphaLink = within(nestedList as HTMLElement).getByRole('link', { name: 'Alpha' });
    const sketchLink = within(nestedList as HTMLElement).getByRole('link', { name: 'Sketch' });

    expect(alphaLink).toHaveAttribute('href', '#picker-specific-props-alpha');
    expect(sketchLink).toHaveAttribute('href', '#picker-specific-props-sketch');
    expect(container.querySelector('#picker-specific-props-alpha h4')).toHaveTextContent('Alpha');
    expect(container.querySelector('#picker-specific-props-sketch h4')).toHaveTextContent('Sketch');
  });

  test('accepts picker-specific prop group hashes as active anchors', () => {
    window.location.hash = '#picker-specific-props-alpha';

    const { container } = render(<App />);
    const sidebar = container.querySelector('.sections-layout__sidebar');
    const alphaLink = within(sidebar as HTMLElement).getByRole('link', { name: 'Alpha' });
    const pickerPropsLink = within(sidebar as HTMLElement).getByRole('link', { name: 'Picker-Specific Props' });

    expect(alphaLink).toHaveAttribute('aria-current', 'location');
    expect(pickerPropsLink).toHaveClass('section-nav__sublink--active');
  });

  test('scrolls the desktop section navigation to the active anchor', async () => {
    setViewportWidth(1024);
    const { container } = render(<App />);
    const navigation = container.querySelector('.sections-layout__sidebar .section-nav') as HTMLElement;
    const sketchLink = within(navigation).getByRole('link', { name: 'Sketch' });
    const scrollTo = vi.fn();

    Object.defineProperty(navigation, 'clientHeight', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(sketchLink, 'clientHeight', {
      configurable: true,
      value: 20,
    });
    Object.defineProperty(navigation, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });
    vi.spyOn(navigation, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 240, 100));
    vi.spyOn(sketchLink, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 220, 240, 20));

    await act(async () => {
      window.location.hash = '#picker-specific-props-sketch';
      window.dispatchEvent(new Event('hashchange'));
    });

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 180, behavior: 'smooth' });
    });
  });

  test('drags the custom desktop section navigation scrollbar thumb', () => {
    setViewportWidth(1024);
    const { container } = render(<App />);
    const navigation = container.querySelector('.sections-layout__sidebar .section-nav') as HTMLElement;
    const scrollbar = container.querySelector('.sections-layout__sidebar .section-nav-scrollbar') as HTMLElement;
    const thumb = container.querySelector('.sections-layout__sidebar .section-nav-scrollbar__thumb') as HTMLElement;
    const shell = container.querySelector('.sections-layout__sidebar .section-nav-shell') as HTMLElement;

    Object.defineProperty(navigation, 'clientHeight', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(navigation, 'scrollHeight', {
      configurable: true,
      value: 300,
    });
    vi.spyOn(scrollbar, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 16, 100));

    fireEvent.pointerDown(thumb, { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 20 });
    fireEvent.pointerMove(window, { pointerId: 1, pointerType: 'mouse', clientY: 40 });

    expect(navigation.scrollTop).toBeCloseTo(166.67, 1);
    expect(shell).toHaveClass('section-nav-shell--dragging');

    fireEvent.pointerUp(window, { pointerId: 1, pointerType: 'mouse' });

    expect(shell).not.toHaveClass('section-nav-shell--dragging');
  });

  test('keeps hash navigation from bouncing through intermediate active anchors', async () => {
    setViewportWidth(1024);
    const { container } = render(<App />);
    const navigation = container.querySelector('.sections-layout__sidebar .section-nav') as HTMLElement;
    const targetSection = container.querySelector('#picker-specific-props-sketch') as HTMLElement;

    vi.spyOn(targetSection, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 1000, 240, 120));

    await act(async () => {
      window.location.hash = '#picker-specific-props-sketch';
      window.dispatchEvent(new Event('hashchange'));
      window.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const sketchLink = within(navigation).getByRole('link', { name: 'Sketch' });
    const aboutLink = navigation.querySelector('[data-anchor-id="about"]');

    expect(sketchLink).toHaveAttribute('aria-current', 'location');
    expect(aboutLink).not.toHaveAttribute('aria-current');
  });

  test('closes the mobile drawer when resizing back to desktop widths', async () => {
    render(<App />);
    const drawerToggle = screen.getByRole('button', { name: /browse sections/i });

    fireEvent.click(drawerToggle);
    expect(drawerToggle).toHaveAttribute('aria-expanded', 'true');

    await act(async () => {
      setViewportWidth(1280);
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(drawerToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('searches props, examples, and picker metadata while syncing the URL query', async () => {
    const { container } = render(<App />);
    const searchInput = container.querySelector('#desktop-docs-search') as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'presetColors' } });

    expect(window.location.search).toBe('?q=presetColors');
    expect(screen.getByRole('link', { name: /presetColors in Sketch/i })).toHaveAttribute(
      'href',
      '#picker-specific-props-sketch-presetcolors',
    );

    fireEvent.change(searchInput, { target: { value: 'onChangeComplete' } });
    expect(
      screen
        .getAllByRole('link', { name: /onChangeComplete/i })
        .some((link) => link.getAttribute('href') === '#on-change-complete'),
    ).toBe(true);

    fireEvent.change(searchInput, { target: { value: 'Sketch' } });
    expect(
      screen
        .getAllByRole('link', { name: /SketchPicker/i })
        .some((link) => link.getAttribute('href') === '#picker-specific-props-sketch'),
    ).toBe(true);

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(searchInput).toHaveValue('');
    expect(window.location.search).toBe('');
  });

  test('focuses search with slash unless the user is already typing', () => {
    const { container } = render(<App />);
    const searchInput = container.querySelector('#desktop-docs-search') as HTMLInputElement;

    fireEvent.keyDown(window, { key: '/' });
    expect(searchInput).toHaveFocus();

    fireEvent.change(searchInput, { target: { value: 'Sketch' } });
    fireEvent.keyDown(window, { key: '/' });
    expect(searchInput).toHaveValue('Sketch');
  });

  test('closes the mobile drawer when a search result is selected', () => {
    render(<App />);
    const drawerToggle = screen.getByRole('button', { name: /browse sections/i });

    fireEvent.click(drawerToggle);

    const drawer = screen.getByRole('dialog', { name: /docs anchors/i });
    const drawerSearch = within(drawer).getByLabelText('Search documentation');
    fireEvent.change(drawerSearch, { target: { value: 'presetColors' } });

    const presetColorsResult = within(drawer).getByRole('link', { name: /presetColors in Sketch/i });
    clickAnchorWithoutNavigation(presetColorsResult);

    expect(drawerToggle).toHaveAttribute('aria-expanded', 'false');
    expect(drawer.closest('.sections-shell__drawer')).toHaveAttribute('hidden');
  });

  test('renders the public picker gallery page with import snippets and API links', async () => {
    window.history.replaceState(null, '', '/gallery');

    const { container } = render(<App />);

    const gallery = await waitFor(() => {
      const element = container.querySelector('.picker-gallery') as HTMLElement | null;
      expect(element).toBeInstanceOf(HTMLElement);
      return element as HTMLElement;
    });
    const galleryCards = gallery.querySelectorAll('.picker-gallery__item');

    expect(screen.getByRole('heading', { name: 'Find the picker that fits the job.' })).toBeInTheDocument();
    expect(container.querySelector('.hero')).not.toBeInTheDocument();
    expect(galleryCards).toHaveLength(14);
    expect(within(gallery).getByRole('heading', { name: 'Sketch' })).toBeInTheDocument();
    const sketchImport = Array.from(gallery.querySelectorAll('.picker-gallery__imports code')).find(
      (code) => code.textContent === "import { SketchPicker } from 'react-color';",
    );
    expect(sketchImport).toBeInstanceOf(HTMLElement);
    expect(sketchImport).toHaveClass('language-tsx');
    expect(sketchImport?.innerHTML).toContain('token keyword');
    expect(within(gallery).getByRole('button', { name: 'Copy: Sketch import' })).toBeInTheDocument();
    expect(within(gallery).queryByText(/react-color\/es\//)).not.toBeInTheDocument();
    expect(within(gallery).getAllByRole('link', { name: 'API props' })).toHaveLength(14);
    expect(within(gallery).getAllByRole('link', { name: 'API props' })[0]).toHaveAttribute(
      'href',
      '/#picker-specific-props-alpha',
    );
    expect(container.querySelector('#picker-specific-props-material')).not.toBeInTheDocument();
  });

  test('renders a dedicated not found page for unknown routes', async () => {
    window.history.replaceState(null, '', '/missing-picker');

    const { container } = render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'This color is outside the palette.' })).toBeInTheDocument();
    });

    const primaryNav = screen.getByRole('navigation', { name: /primary navigation/i });

    expect(screen.getByText('404 / Page not found')).toBeInTheDocument();
    expect(container.querySelector('.hero')).not.toBeInTheDocument();
    expect(container.querySelector('.sections-layout')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /skip to 404 message/i })).toHaveAttribute('href', '#site-not-found');
    expect(within(primaryNav).getByRole('link', { name: 'Read the docs' })).not.toHaveAttribute('aria-current', 'page');
    expect(
      screen.getAllByRole('link', { name: 'Read the docs' }).some((link) => link.getAttribute('href') === '/'),
    ).toBe(true);
    expect(screen.getByRole('link', { name: 'Open picker gallery' })).toHaveAttribute('href', '/gallery');
  });

  test('copies highlighted picker gallery import snippets', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    window.history.replaceState(null, '', '/gallery');

    render(<App />);
    const copyButton = await screen.findByRole('button', { name: 'Copy: Sketch import' });
    const importSnippet = copyButton.closest('.picker-gallery__imports') as HTMLElement;

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("import { SketchPicker } from 'react-color';");
      expect(copyButton).toHaveTextContent('Copied');
      expect(within(importSnippet).getByText('Code copied to clipboard.')).toHaveAttribute('aria-live', 'polite');
    });
  });

  test('keeps gallery picker changes synchronized with the page background', async () => {
    window.history.replaceState(null, '', '/gallery');

    const { container } = render(<App />);

    const siteShell = await waitFor(() => {
      const element = container.querySelector('.site-shell') as HTMLElement | null;
      expect(element).toBeInstanceOf(HTMLElement);
      return element as HTMLElement;
    });
    const githubSwatch = container.querySelector('#picker-github [tabindex="0"]');

    expect(githubSwatch).toBeInstanceOf(HTMLElement);
    expect(siteShell).toHaveStyle('--site-accent: rgba(61, 145, 255, 1)');

    fireEvent.click(githubSwatch as HTMLElement);

    expect(siteShell.getAttribute('style')).not.toContain('rgba(61, 145, 255, 1)');
  });

  test('keeps prop names as text and collapses long default values', () => {
    const { container } = render(<App />);
    const presetColorsLink = screen.queryByRole('link', { name: 'presetColors' });

    expect(presetColorsLink).not.toBeInTheDocument();
    expect(screen.getAllByText('presetColors').length).toBeGreaterThan(0);

    const sketchGroup = container.querySelector('#picker-specific-props-sketch') as HTMLElement;
    const defaultToggle = within(sketchGroup).getAllByRole('button', { name: 'Show default' })[0];

    expect(sketchGroup).not.toHaveTextContent('#D0021B');

    fireEvent.click(defaultToggle);

    expect(defaultToggle).toHaveTextContent('Hide default');
    expect(sketchGroup).toHaveTextContent('#D0021B');
  });

  test('renders mobile API prop cards alongside the desktop table data', () => {
    setViewportWidth(390);

    const { container } = render(<App />);
    const sketchGroup = container.querySelector('#picker-specific-props-sketch') as HTMLElement;
    const propCards = sketchGroup.querySelectorAll('.api-prop-card');

    expect(propCards.length).toBeGreaterThan(0);
    expect(within(propCards[0] as HTMLElement).getByText('Prop')).toBeInTheDocument();
    expect(within(propCards[0] as HTMLElement).getByText('Type')).toBeInTheDocument();
    expect(within(propCards[0] as HTMLElement).getByText('Default')).toBeInTheDocument();
    expect(within(propCards[0] as HTMLElement).getByText('Description')).toBeInTheDocument();
  });

  test('does not render an API table for empty property groups', () => {
    const { container } = render(<App />);
    const materialGroup = container.querySelector('#picker-specific-props-material') as HTMLElement;

    expect(materialGroup).toBeInTheDocument();
    expect(materialGroup.querySelector('.api-table')).not.toBeInTheDocument();
  });
});
