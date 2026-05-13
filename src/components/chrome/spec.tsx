import { fireEvent, waitFor } from '@testing-library/react';
import { red, simpleCheckForValidColor } from '@/helpers/color';
import { expect, test, vi } from 'vitest';

import { Chrome } from './Chrome';
import { ChromeFields } from './ChromeFields';
import { ChromePointer } from './ChromePointer';
import { ChromePointerCircle } from './ChromePointerCircle';
import {
  changeInputByLabel,
  createColorChangeSpy,
  getRequiredElement,
  getRootElement,
  renderForSnapshot,
} from '@test/helpers';

test('Chrome renders correctly', () => {
  renderForSnapshot(<Chrome {...red} />).expectSnapshot();
});

test('Chrome renders correctly in dark theme', () => {
  renderForSnapshot(<Chrome {...red} theme="dark" />).expectSnapshot();
});

test('Chrome onChange events correctly', () => {
  const changeSpy = createColorChangeSpy({ simpleCheckForValidColor });
  renderForSnapshot(<Chrome {...red} onChange={changeSpy} />);

  changeInputByLabel('hex', '#00ff00');
  expect(changeSpy).toHaveBeenCalled();
});

test('ChromeFields renders correctly', () => {
  renderForSnapshot(<ChromeFields {...red} onChange={() => {}} />).expectSnapshot();
});

test('ChromePointer renders correctly', () => {
  renderForSnapshot(<ChromePointer />).expectSnapshot();
});

test('ChromePointerCircle renders correctly', () => {
  renderForSnapshot(<ChromePointerCircle />).expectSnapshot();
});

test('Chrome renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Chrome styles={{ default: { picker: { boxShadow: 'none' } } }} />);
  expect(getRootElement(container).style.boxShadow).toBe('none');
});

test('Chrome renders correctly with width', () => {
  const { container } = renderForSnapshot(<Chrome width={300} />);
  expect(getRootElement(container).style.width).toBe('300px');
});

test('Chrome exposes public styling hooks on the root element', () => {
  const { container } = renderForSnapshot(
    <Chrome theme="dark" className="legacy-root" classNames={{ root: 'consumer-root' }} disableAlpha />,
  );
  const picker = getRootElement(container);

  expect(picker.className).toContain('rc-chrome');
  expect(picker.className).toContain('rc-chrome--dark');
  expect(picker.className).toContain('rc-chrome--disabled-alpha');
  expect(picker.className).toContain('chrome-picker');
  expect(picker.className).toContain('legacy-root');
  expect(picker.className).toContain('consumer-root');
});

test('Chrome marks auto theme on the root element', () => {
  const { container } = renderForSnapshot(<Chrome theme="auto" />);
  expect(getRootElement(container).getAttribute('data-theme')).toBe('auto');
});

test('Chrome alpha updates immediately with only onChangeComplete', async () => {
  const onChangeComplete = vi.fn();
  const { container } = renderForSnapshot(<Chrome color={red.hsl} onChangeComplete={onChangeComplete} />);
  const alphaControl = getRequiredElement(container, '.rc-alpha-control__container');

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

  const alphaPointer = getRequiredElement(alphaControl, '.rc-alpha-control__pointer');

  await waitFor(() => {
    expect(alphaPointer.style.left).toBe('25%');
  });
  await waitFor(() => {
    expect(onChangeComplete).toHaveBeenCalled();
  });
});
