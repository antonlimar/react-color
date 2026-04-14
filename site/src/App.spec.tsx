import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import App from './App';

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
}

describe('site app', () => {
  beforeEach(() => {
    window.location.hash = '';
    setViewportWidth(768);
  });

  test('keeps the hero state synchronized when a picker changes color', () => {
    const { container } = render(<App />);
    const siteShell = container.querySelector('.site-shell');
    const githubSwatch = container.querySelector('.hero__picker-card--github [tabindex="0"]');
    const heroDemoValue = container.querySelector('.hero__demo-value');

    expect(siteShell).toHaveStyle('--site-accent: rgba(61, 145, 255, 1)');
    expect(githubSwatch).toBeInstanceOf(HTMLElement);
    expect(heroDemoValue).toHaveTextContent('#3D91FF');

    fireEvent.click(githubSwatch as HTMLElement);

    expect(heroDemoValue).not.toHaveTextContent('#3D91FF');
    expect(siteShell?.getAttribute('style')).not.toContain('rgba(61, 145, 255, 1)');
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
    fireEvent.click(drawerInstallLink);

    expect(drawerToggle).toHaveAttribute('aria-expanded', 'false');
    expect(drawerNav?.closest('.sections-shell__drawer')).toHaveAttribute('hidden');
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
});
