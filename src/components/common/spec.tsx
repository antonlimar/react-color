import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { red } from '../../helpers/color';
import * as color from '../../helpers/color';

import { Alpha } from './Alpha';
import { Checkboard } from './Checkboard';
import { ColorWrap } from './ColorWrap';
import { EditableInput } from './EditableInput';
import { Hue } from './Hue';
import { Raised } from './Raised';
import { Saturation, getSaturationRenderWindow } from './Saturation';
import { Swatch } from './Swatch';
import {
  getArchitectureClassName,
  getBlockClassName,
  getElementClassName,
  getModifierClassName,
  getPickerClassName,
  getPickerRootProps,
  getThemeDataAttributes,
  getThemeModifier,
  stylingArchitecture,
} from './styleArchitecture';
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

test('common primitives expose the expected BEM classes after styling modernization', () => {
  const { container: alphaContainer } = render(<Alpha {...red} />);
  expect(alphaContainer.firstElementChild).toHaveClass('rc-alpha-control');
  expect(alphaContainer.querySelector('.rc-alpha-control__gradient')).not.toBeNull();

  const { container: hueContainer } = render(<Hue {...red} />);
  expect(hueContainer.firstElementChild).toHaveClass('rc-hue-control');
  expect(hueContainer.querySelector('.rc-hue-control__container')).not.toBeNull();

  const { container: saturationContainer } = render(<Saturation {...red} />);
  expect(saturationContainer.firstElementChild).toHaveClass('rc-saturation');
  expect(saturationContainer.querySelector('.rc-saturation__white')).not.toBeNull();

  const { container: editableInputContainer } = render(<EditableInput label="Hex" />);
  expect(editableInputContainer.firstElementChild).toHaveClass('rc-editable-input');
  expect(editableInputContainer.querySelector('.rc-editable-input__label')).not.toBeNull();

  const { container: swatchContainer } = render(<Swatch color="transparent" />);
  expect(swatchContainer.querySelector('.rc-swatch')).not.toBeNull();
  expect(swatchContainer.querySelector('.rc-checkboard')).not.toBeNull();

  const { container: raisedContainer } = render(<Raised>content</Raised>);
  expect(raisedContainer.firstElementChild).toHaveClass('rc-raised');
  expect(raisedContainer.querySelector('.rc-raised__bg')).not.toBeNull();
});

test('Raised can opt into theme-aware tokens for wrappers that do not inherit picker variables', () => {
  const { container } = render(<Raised theme="dark">content</Raised>);
  const raised = container.firstElementChild as HTMLElement | null;
  const background = container.querySelector('.rc-raised__bg') as HTMLElement | null;

  expect(raised).toHaveClass('rc-raised', 'rc-raised--dark');
  expect(background?.style.background).toBe('var(--rc-picker-surface, #fff)');
});

test('styling architecture reserves the rc namespace for all picker and primitive blocks', () => {
  expect(stylingArchitecture.namespace).toBe('rc');
  expect(stylingArchitecture.blocks.chrome).toBe('rc-chrome');
  expect(stylingArchitecture.blocks.sketch).toBe('rc-sketch');
  expect(stylingArchitecture.blocks.editableInput).toBe('rc-editable-input');
  expect(stylingArchitecture.blocks.saturation).toBe('rc-saturation');
});

test('styling architecture builds BEM element and modifier class names from block definitions', () => {
  expect(getBlockClassName('chrome')).toBe('rc-chrome');
  expect(getElementClassName('chrome', 'body')).toBe('rc-chrome__body');
  expect(getElementClassName('chrome', 'root')).toBe('rc-chrome');
  expect(getModifierClassName('chrome', 'dark')).toBe('rc-chrome--dark');
  expect(getModifierClassName('chrome', 'disabled alpha')).toBe('rc-chrome--disabled-alpha');
});

test('styling architecture composes root, modifiers, and user classes into one predictable class list', () => {
  expect(
    getArchitectureClassName({
      block: 'sketch',
      element: 'controls',
      modifiers: ['dark', false, undefined, 'vertical'],
      className: 'custom-slot another-class',
    }),
  ).toBe('rc-sketch__controls rc-sketch--dark rc-sketch--vertical custom-slot another-class');
});

test('styling architecture derives theme modifiers and auto theme data markers for picker roots', () => {
  expect(getThemeModifier('dark')).toBe('dark');
  expect(getThemeModifier('light')).toBe('light');
  expect(getThemeModifier('auto')).toBeUndefined();
  expect(getThemeDataAttributes('auto')).toEqual({ 'data-theme': 'auto' });
  expect(getThemeDataAttributes('dark')).toEqual({});
});

test('styling architecture merges legacy picker classes with slot-level classNames for public styling API', () => {
  expect(
    getPickerClassName({
      block: 'chrome',
      slot: 'root',
      className: 'chrome-picker custom-root',
      classNames: { root: 'consumer-root' },
      modifiers: ['dark'],
    }),
  ).toBe('rc-chrome rc-chrome--dark chrome-picker custom-root consumer-root');

  expect(
    getPickerRootProps({
      block: 'chrome',
      theme: 'auto',
      className: 'chrome-picker custom-root',
      classNames: { root: 'consumer-root' },
    }),
  ).toEqual({
    className: 'rc-chrome chrome-picker custom-root consumer-root',
    'data-theme': 'auto',
  });
});
