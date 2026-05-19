import { getRootElement, renderForSnapshot } from '@test/helpers';
import { fireEvent, screen } from '@testing-library/react';
import { noop } from 'lodash-es';
import { expect, vi } from 'vitest';
import { red } from '@/helpers';
import { Slider } from './Slider';
import { SliderPointer } from './SliderPointer';
import { SliderSwatch } from './SliderSwatch';
import { SliderSwatches } from './SliderSwatches';

test('Slider renders correctly', () => {
  renderForSnapshot(<Slider {...red} />).expectSnapshot();
});

test('Slider renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Slider styles={{ default: { wrap: { boxShadow: 'none' } } }} />);

  expect(getRootElement(container).style.boxShadow).toBe('none');
});

test('SliderPointer renders correctly', () => {
  renderForSnapshot(<SliderPointer />).expectSnapshot();
});

test('SliderSwatch renders correctly', () => {
  renderForSnapshot(<SliderSwatch {...red} offset={0.5} />).expectSnapshot();
});

test('SliderSwatch is keyboard operable', () => {
  const onClick = vi.fn();
  renderForSnapshot(<SliderSwatch {...red} offset={0.5} onClick={onClick} active />);
  const swatch = screen.getByRole('button', { name: 'Select 50% lightness' });

  expect(swatch).toHaveAttribute('tabindex', '0');
  expect(swatch).toHaveAttribute('aria-pressed', 'true');

  fireEvent.keyDown(swatch, { key: 'Enter' });
  fireEvent.keyDown(swatch, { key: ' ' });

  expect(onClick).toHaveBeenCalledTimes(2);
  expect(onClick.mock.calls[0][0]).toMatchObject({
    h: red.hsl.h,
    s: 0.5,
    l: 0.5,
    source: 'hsl',
  });
});

test('SliderSwatches renders correctly', () => {
  renderForSnapshot(<SliderSwatches {...red} onClick={noop} />).expectSnapshot();
});
