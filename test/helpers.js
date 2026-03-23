import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

export function renderForSnapshot(element) {
  const view = render(element);

  return {
    ...view,
    expectSnapshot() {
      expect(view.asFragment()).toMatchSnapshot();
    },
  };
}

export function renderComponent(Component, props, ...children) {
  return renderForSnapshot(React.createElement(Component, props, ...children));
}

export function createColorChangeSpy(color) {
  return vi.fn((data) => {
    expect(color.simpleCheckForValidColor(data)).toBeTruthy();
  });
}

export function getFirstSwatch(container) {
  const swatch = container.querySelector('[tabindex="0"]');

  if (!swatch) {
    throw new Error('Expected a swatch element with tabindex="0"');
  }

  return swatch;
}

export function clickFirstSwatch(container) {
  fireEvent.click(getFirstSwatch(container));
}

export function hoverFirstSwatch(container) {
  fireEvent.mouseOver(getFirstSwatch(container));
}

export function changeInputByLabel(label, value) {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value } });
  return input;
}
