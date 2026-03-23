import React from 'react';

import Block from './Block';
import BlockSwatches from './BlockSwatches';
import * as color from '../../helpers/color';
import { clickFirstSwatch, createColorChangeSpy, hoverFirstSwatch, renderForSnapshot } from '../../../test/helpers';

test('Block renders correctly', () => {
  renderForSnapshot(<Block />).expectSnapshot();
});

test('Block onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Block onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Block with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Block onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('Block `triangle="hide"`', () => {
  renderForSnapshot(<Block triangle="hide" />).expectSnapshot();
});

test('BlockSwatches renders correctly', () => {
  renderForSnapshot(<BlockSwatches colors={['#fff', '#999', '#000']} />).expectSnapshot();
});

test('Block renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Block styles={{ default: { card: { boxShadow: 'none' } } }} />);

  expect(container.firstChild.style.boxShadow).toBe('none');
});
