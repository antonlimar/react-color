import React from 'react';
import { red } from '../../helpers/color';

import Slider from './Slider';
import SliderPointer from './SliderPointer';
import SliderSwatch from './SliderSwatch';
import SliderSwatches from './SliderSwatches';
import { renderForSnapshot } from '../../../test/helpers';

test('Slider renders correctly', () => {
  renderForSnapshot(<Slider {...red} />).expectSnapshot();
});

test('Slider renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Slider styles={{ default: { wrap: { boxShadow: 'none' } } }} />);

  expect(container.firstChild.style.boxShadow).toBe('none');
});

test('SliderPointer renders correctly', () => {
  renderForSnapshot(<SliderPointer />).expectSnapshot();
});

test('SliderSwatch renders correctly', () => {
  renderForSnapshot(<SliderSwatch {...red} />).expectSnapshot();
});

test('SliderSwatches renders correctly', () => {
  renderForSnapshot(<SliderSwatches {...red} />).expectSnapshot();
});
