import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { red } from '../../helpers/color';
import * as color from '../../helpers/color';

import Alpha from './Alpha';
import Checkboard from './Checkboard';
import ColorWrap from './ColorWrap';
import EditableInput from './EditableInput';
import Hue from './Hue';
import Saturation, { getSaturationRenderWindow } from './Saturation';
import Swatch from './Swatch';
import { renderForSnapshot } from '../../../test/helpers';
import type { Color, ColorPickerInjectedProps } from '../../types';

test('Alpha renders correctly', () => {
  renderForSnapshot(<Alpha {...red} />).expectSnapshot();
});

test('Checkboard renders correctly', () => {
  renderForSnapshot(<Checkboard />).expectSnapshot();
});

test('Checkboard renders children correctly', () => {
  renderForSnapshot(
    <Checkboard>
      <button>Click</button>
    </Checkboard>,
  ).expectSnapshot();
});

test('EditableInput renders correctly', () => {
  renderForSnapshot(<EditableInput label="Hex" placeholder="#fff" />).expectSnapshot();
});

test('Hue renders correctly', () => {
  renderForSnapshot(<Hue {...red} />).expectSnapshot();
});

test('Saturation renders correctly', () => {
  renderForSnapshot(<Saturation {...red} />).expectSnapshot();
});

test('ColorWrap provides the same runtime default color', () => {
  const WrappedPicker = ColorWrap(({ color: passedColor, hex }: ColorPickerInjectedProps & { color?: Color }) => (
    <div data-color-present={String(passedColor !== undefined)} data-hex={hex} />
  ));
  const defaultHex = color.toState({ h: 250, s: 0.5, l: 0.2, a: 1 }, 0).hex;
  const { container } = render(<WrappedPicker />);
  const wrapped = container.firstElementChild;

  expect(wrapped).not.toBeNull();
  expect(wrapped?.getAttribute('data-color-present')).toBe('true');
  expect(wrapped?.getAttribute('data-hex')).toBe(defaultHex);
});

test('Hue and Saturation do not render runtime style tags', () => {
  const { container: hueContainer } = render(<Hue {...red} />);
  expect(hueContainer.querySelector('style')).toBeNull();

  const { container: saturationContainer } = render(<Saturation {...red} />);
  expect(saturationContainer.querySelector('style')).toBeNull();
});

test('Saturation uses ownerDocument.defaultView for drag listeners when available', () => {
  const ownerWindow = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as unknown as Window;

  const container = {
    ownerDocument: {
      defaultView: ownerWindow,
    },
  } as HTMLDivElement;

  expect(getSaturationRenderWindow(container)).toBe(ownerWindow);
});

test('Saturation falls back to the current window when container render window is unavailable', () => {
  const container = {
    ownerDocument: {
      defaultView: null,
    },
  } as HTMLDivElement;

  expect(getSaturationRenderWindow(container)).toBe(window);
});

test('Swatch renders correctly', () => {
  renderForSnapshot(<Swatch color="#333" style={{ opacity: '0.4' }} />).expectSnapshot();
});

test('Swatch renders custom title correctly', () => {
  renderForSnapshot(<Swatch color="#fff" title="white" />).expectSnapshot();
});

test('Swatch renders with an onMouseOver handler correctly', () => {
  renderForSnapshot(<Swatch color="#fff" title="white" onHover={() => {}} />).expectSnapshot();
});
