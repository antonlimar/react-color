import { fireEvent, waitFor } from '@testing-library/react';
import * as color from '../../helpers/color';
import { expect, test, vi } from 'vitest';

import Chrome from './Chrome';
import ChromeFields from './ChromeFields';
import ChromePointer from './ChromePointer';
import ChromePointerCircle from './ChromePointerCircle';
import { changeInputByLabel, createColorChangeSpy, renderForSnapshot } from '../../../test/helpers';

test('Chrome renders correctly', () => {
  renderForSnapshot(<Chrome {...color.red} />).expectSnapshot();
});

test('Chrome renders correctly in dark theme', () => {
  renderForSnapshot(<Chrome {...color.red} theme="dark" />).expectSnapshot();
});

test('Chrome onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  renderForSnapshot(<Chrome {...color.red} onChange={changeSpy} />);

  changeInputByLabel('hex', '#00ff00');
  expect(changeSpy).toHaveBeenCalled();
});

test('ChromeFields renders correctly', () => {
  renderForSnapshot(<ChromeFields {...color.red} onChange={() => {}} />).expectSnapshot();
});

test('ChromePointer renders correctly', () => {
  renderForSnapshot(<ChromePointer />).expectSnapshot();
});

test('ChromePointerCircle renders correctly', () => {
  renderForSnapshot(<ChromePointerCircle />).expectSnapshot();
});

test('Chrome renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Chrome styles={{ default: { picker: { boxShadow: 'none' } } }} />);
  const picker = container.firstChild;

  expect(picker).toBeInstanceOf(HTMLElement);
  expect((picker as HTMLElement).style.boxShadow).toBe('none');
});

test('Chrome renders correctly with width', () => {
  const { container } = renderForSnapshot(<Chrome width={300} />);
  const picker = container.firstChild;

  expect(picker).toBeInstanceOf(HTMLElement);
  expect((picker as HTMLElement).style.width).toBe('300px');
});

test('Chrome exposes public styling hooks on the root element', () => {
  const { container } = renderForSnapshot(
    <Chrome theme="dark" className="legacy-root" classNames={{ root: 'consumer-root' }} disableAlpha />,
  );
  const picker = container.firstChild;

  expect(picker).toBeInstanceOf(HTMLElement);
  expect((picker as HTMLElement).className).toContain('rc-chrome');
  expect((picker as HTMLElement).className).toContain('rc-chrome--dark');
  expect((picker as HTMLElement).className).toContain('rc-chrome--disabled-alpha');
  expect((picker as HTMLElement).className).toContain('chrome-picker');
  expect((picker as HTMLElement).className).toContain('legacy-root');
  expect((picker as HTMLElement).className).toContain('consumer-root');
});

test('Chrome marks auto theme on the root element', () => {
  const { container } = renderForSnapshot(<Chrome theme="auto" />);
  const picker = container.firstChild;

  expect(picker).toBeInstanceOf(HTMLElement);
  expect((picker as HTMLElement).getAttribute('data-theme')).toBe('auto');
});

test('Chrome alpha updates immediately with only onChangeComplete', async () => {
  const onChangeComplete = vi.fn();
  const { container } = renderForSnapshot(<Chrome color={color.red.hsl} onChangeComplete={onChangeComplete} />);
  const alphaControl = container.querySelector('.rc-alpha-control__container') as HTMLDivElement | null;

  expect(alphaControl).toBeTruthy();
  if (!alphaControl) {
    throw new Error('Expected alpha control to render');
  }

  Object.defineProperty(alphaControl, 'clientWidth', {
    configurable: true,
    value: 200,
  });
  Object.defineProperty(alphaControl, 'clientHeight', {
    configurable: true,
    value: 10,
  });
  alphaControl.getBoundingClientRect = () =>
    ({
      width: 200,
      height: 10,
      top: 0,
      left: 0,
      right: 200,
      bottom: 10,
      x: 0,
      y: 0,
      toJSON: () => '',
    }) as DOMRect;

  fireEvent.mouseDown(alphaControl, {
    pageX: 50,
    pageY: 5,
    clientX: 50,
    clientY: 5,
  });

  const alphaPointer = alphaControl.querySelector('.rc-alpha-control__pointer') as HTMLDivElement | null;
  expect(alphaPointer).toBeTruthy();
  if (!alphaPointer) {
    throw new Error('Expected alpha pointer to render');
  }

  await waitFor(() => {
    expect(alphaPointer.style.left).toBe('25%');
  });
  await waitFor(() => {
    expect(onChangeComplete).toHaveBeenCalled();
  });
});
