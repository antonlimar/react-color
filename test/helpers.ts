import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { expect, vi } from 'vitest';

type SnapshotRenderResult = RenderResult & {
  expectSnapshot: () => void;
};

type ValidColorChecker = {
  simpleCheckForValidColor: (data: unknown) => boolean;
};

export function renderForSnapshot(element: React.ReactElement): SnapshotRenderResult {
  const view = render(element);

  return {
    ...view,
    expectSnapshot() {
      expect(view.asFragment()).toMatchSnapshot();
    },
  };
}

export function renderComponent(
  Component: React.ElementType,
  props?: Record<string, unknown> | null,
  ...children: React.ReactNode[]
): SnapshotRenderResult {
  return renderForSnapshot(React.createElement(Component, props, ...children));
}

export function createColorChangeSpy(color: ValidColorChecker) {
  return vi.fn((data: unknown) => {
    expect(color.simpleCheckForValidColor(data)).toBeTruthy();
  });
}

export function getFirstSwatch(container: HTMLElement): HTMLElement {
  const swatch = container.querySelector('[tabindex="0"]');

  if (!(swatch instanceof HTMLElement)) {
    throw new Error('Expected a swatch element with tabindex="0"');
  }

  return swatch;
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
