import { fireEvent, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { expect, vi } from 'vitest';
import type { ReactElement, ElementType, ReactNode } from 'react';
import type { RenderResult } from '@testing-library/react';

type SnapshotRenderResult = RenderResult & {
  expectSnapshot: () => void;
};

type ValidColorChecker = {
  simpleCheckForValidColor: <T>(data: T) => T | false;
};

export function renderForSnapshot(element: ReactElement): SnapshotRenderResult {
  const view = render(element);

  return {
    ...view,
    expectSnapshot() {
      expect(view.asFragment()).toMatchSnapshot();
    },
  };
}

export function renderComponent(
  Component: ElementType,
  props?: Record<string, unknown> | null,
  ...children: ReactNode[]
): SnapshotRenderResult {
  return renderForSnapshot(createElement(Component, props, ...children));
}

export function createColorChangeSpy(color: ValidColorChecker) {
  return vi.fn((data: unknown) => {
    expect(color.simpleCheckForValidColor(data)).toBeTruthy();
  });
}

export function getFirstSwatch(container: HTMLElement): HTMLElement {
  const swatch = container.querySelector('.rc-swatch[tabindex="0"], [data-testid="swatch"][tabindex="0"]');

  if (!(swatch instanceof HTMLElement)) {
    throw new Error('Expected a swatch element with tabindex="0"');
  }

  return swatch;
}

export function getRootElement(container: HTMLElement): HTMLElement {
  const root = container.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    throw new Error('Expected root element to render');
  }

  return root;
}

export function getRequiredElement(container: ParentNode, selector: string): HTMLElement {
  const element = container.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Expected element matching "${selector}" to render`);
  }

  return element;
}

export function clickFirstSwatch(container: HTMLElement): void {
  fireEvent.click(getFirstSwatch(container));
}

export function hoverFirstSwatch(container: HTMLElement): void {
  fireEvent.mouseOver(getFirstSwatch(container));
}

export function changeInputByLabel(label: string, value: string): HTMLElement {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value } });
  return input;
}
