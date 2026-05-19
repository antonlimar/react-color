import { getRequiredElement, getRootElement, renderForSnapshot } from '@test/helpers';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { red, toState } from '@/helpers';
import type { Color, ColorPickerInjectedProps } from '@/types';
import { Alpha } from './Alpha';
import { Checkboard } from './Checkboard';
import { ColorWrap } from './ColorWrap';
import { EditableInput } from './EditableInput';
import { Hue } from './Hue';
import { Raised } from './Raised';
import { Saturation, getSaturationRenderWindow } from './Saturation';
import { bem, getThemeDataAttributes, stylingArchitecture } from './styleArchitecture';
import { Swatch } from './Swatch';

const chromeBem = bem('chrome');
const sketchBem = bem('sketch');

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

test('Hue exposes slider semantics and keyboard controls', () => {
  const onChange = vi.fn();
  render(<Hue {...red} hsl={{ ...red.hsl, h: 120 }} onChange={onChange} />);

  const slider = screen.getByRole('slider');
  expect(slider).toHaveAttribute('tabindex', '0');
  expect(slider).toHaveAttribute('aria-valuemin', '0');
  expect(slider).toHaveAttribute('aria-valuemax', '359');
  expect(slider).toHaveAttribute('aria-valuenow', '120');
  expect(slider).toHaveAttribute('aria-orientation', 'horizontal');

  fireEvent.keyDown(slider, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: 121, s: red.hsl.s, l: red.hsl.l, a: red.hsl.a, source: 'hsl' },
    expect.objectContaining({ key: 'ArrowRight' }),
  );

  fireEvent.keyDown(slider, { key: 'PageDown' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: 110, s: red.hsl.s, l: red.hsl.l, a: red.hsl.a, source: 'hsl' },
    expect.objectContaining({ key: 'PageDown' }),
  );

  fireEvent.keyDown(slider, { key: 'End' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: 359, s: red.hsl.s, l: red.hsl.l, a: red.hsl.a, source: 'hsl' },
    expect.objectContaining({ key: 'End' }),
  );
});

test('Hue keyboard controls clamp values and preserve vertical arrow direction', () => {
  const onChange = vi.fn();
  render(<Hue {...red} hsl={{ ...red.hsl, h: 359 }} direction="vertical" onChange={onChange} />);

  const slider = screen.getByRole('slider');
  expect(slider).toHaveAttribute('aria-orientation', 'vertical');

  fireEvent.keyDown(slider, { key: 'ArrowUp' });
  expect(onChange).not.toHaveBeenCalled();

  fireEvent.keyDown(slider, { key: 'Home' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: 0, s: red.hsl.s, l: red.hsl.l, a: red.hsl.a, source: 'hsl' },
    expect.objectContaining({ key: 'Home' }),
  );
});

test('Saturation renders correctly', () => {
  renderForSnapshot(<Saturation {...red} />).expectSnapshot();
});

test('Alpha exposes slider semantics and keyboard controls', () => {
  const onChange = vi.fn();
  render(<Alpha {...red} hsl={{ ...red.hsl, a: 0.5 }} rgb={{ ...red.rgb, a: 0.5 }} a={0.5} onChange={onChange} />);

  const slider = screen.getByRole('slider');
  expect(slider).toHaveAttribute('tabindex', '0');
  expect(slider).toHaveAttribute('aria-valuemin', '0');
  expect(slider).toHaveAttribute('aria-valuemax', '100');
  expect(slider).toHaveAttribute('aria-valuenow', '50');
  expect(slider).toHaveAttribute('aria-orientation', 'horizontal');

  fireEvent.keyDown(slider, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: red.hsl.h, s: red.hsl.s, l: red.hsl.l, a: 0.51, source: 'rgb' },
    expect.objectContaining({ key: 'ArrowRight' }),
  );

  fireEvent.keyDown(slider, { key: 'PageDown' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: red.hsl.h, s: red.hsl.s, l: red.hsl.l, a: 0.4, source: 'rgb' },
    expect.objectContaining({ key: 'PageDown' }),
  );

  fireEvent.keyDown(slider, { key: 'Home' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: red.hsl.h, s: red.hsl.s, l: red.hsl.l, a: 0, source: 'rgb' },
    expect.objectContaining({ key: 'Home' }),
  );
});

test('Alpha keyboard controls clamp values', () => {
  const onChange = vi.fn();
  render(<Alpha {...red} direction="vertical" onChange={onChange} />);

  const slider = screen.getByRole('slider');
  expect(slider).toHaveAttribute('aria-orientation', 'vertical');

  fireEvent.keyDown(slider, { key: 'ArrowUp' });
  expect(onChange).not.toHaveBeenCalled();

  fireEvent.keyDown(slider, { key: 'PageDown' });
  expect(onChange).toHaveBeenLastCalledWith(
    { h: red.hsl.h, s: red.hsl.s, l: red.hsl.l, a: 0.9, source: 'rgb' },
    expect.objectContaining({ key: 'PageDown' }),
  );
});

test('ColorWrap provides the same runtime default color', () => {
  const WrappedPicker = ColorWrap(({ color: passedColor, hex }: ColorPickerInjectedProps & { color?: Color }) => (
    <div data-color-present={String(passedColor !== undefined)} data-hex={hex} />
  ));
  const defaultHex = toState({ h: 250, s: 0.5, l: 0.2, a: 1 }, 0).hex;
  const { container } = render(<WrappedPicker />);
  const wrapped = getRootElement(container);

  expect(wrapped.getAttribute('data-color-present')).toBe('true');
  expect(wrapped.getAttribute('data-hex')).toBe(defaultHex);
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
  expect(getRootElement(alphaContainer)).toHaveClass('rc-alpha-control');
  expect(getRequiredElement(alphaContainer, '.rc-alpha-control__gradient')).toBeInTheDocument();

  const { container: hueContainer } = render(<Hue {...red} />);
  expect(getRootElement(hueContainer)).toHaveClass('rc-hue-control');
  expect(getRequiredElement(hueContainer, '.rc-hue-control__container')).toBeInTheDocument();

  const { container: saturationContainer } = render(<Saturation {...red} />);
  expect(getRootElement(saturationContainer)).toHaveClass('rc-saturation');
  expect(getRequiredElement(saturationContainer, '.rc-saturation__white')).toBeInTheDocument();

  const { container: editableInputContainer } = render(<EditableInput label="Hex" />);
  expect(getRootElement(editableInputContainer)).toHaveClass('rc-editable-input');
  expect(getRequiredElement(editableInputContainer, '.rc-editable-input__label')).toBeInTheDocument();

  const { container: swatchContainer } = render(<Swatch color="transparent" />);
  expect(getRequiredElement(swatchContainer, '.rc-swatch')).toBeInTheDocument();
  expect(getRequiredElement(swatchContainer, '.rc-checkboard')).toBeInTheDocument();

  const { container: raisedContainer } = render(<Raised>content</Raised>);
  expect(getRootElement(raisedContainer)).toHaveClass('rc-raised');
  expect(getRequiredElement(raisedContainer, '.rc-raised__bg')).toBeInTheDocument();
});

test('Raised can opt into theme-aware tokens for wrappers that do not inherit picker variables', () => {
  const { container } = render(<Raised theme="dark">content</Raised>);
  const raised = getRootElement(container);
  const background = getRequiredElement(container, '.rc-raised__bg');

  expect(raised).toHaveClass('rc-raised', 'rc-raised--dark');
  expect(background.style.background).toBe('var(--rc-picker-surface, #fff)');
});

test('styling architecture reserves the rc namespace for all picker and primitive blocks', () => {
  expect(stylingArchitecture.namespace).toBe('rc');
  expect(stylingArchitecture.blocks.chrome).toBe('rc-chrome');
  expect(stylingArchitecture.blocks.sketch).toBe('rc-sketch');
  expect(stylingArchitecture.blocks.editableInput).toBe('rc-editable-input');
  expect(stylingArchitecture.blocks.saturation).toBe('rc-saturation');
});

test('styling architecture composes elements, modifiers, and user classes through bem-cn', () => {
  expect(
    sketchBem('controls', { dark: true, vertical: true })
      .mix('custom-slot another-class', 'consumer-controls')
      .toString(),
  ).toBe(
    'rc-sketch__controls rc-sketch__controls--dark rc-sketch__controls--vertical custom-slot another-class consumer-controls',
  );

  expect(chromeBem('body', { 'disabled-alpha': true }).toString()).toBe(
    'rc-chrome__body rc-chrome__body--disabled-alpha',
  );
});

test('styling architecture derives auto theme data markers for picker roots', () => {
  expect(getThemeDataAttributes('auto')).toEqual({ 'data-theme': 'auto' });
  expect(getThemeDataAttributes('dark')).toEqual({});
});

test('styling architecture merges legacy picker classes with slot-level classNames for public styling API', () => {
  expect(chromeBem({ dark: true }).mix('chrome-picker custom-root', 'consumer-root').toString()).toBe(
    'rc-chrome rc-chrome--dark chrome-picker custom-root consumer-root',
  );

  expect({
    className: chromeBem.mix('chrome-picker custom-root', 'consumer-root').toString(),
    ...getThemeDataAttributes('auto'),
  }).toEqual({
    className: 'rc-chrome chrome-picker custom-root consumer-root',
    'data-theme': 'auto',
  });
});
