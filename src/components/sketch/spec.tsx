import React from 'react';
import * as color from '../../helpers/color';

import Sketch from './Sketch';
import SketchFields from './SketchFields';
import SketchPresetColors from './SketchPresetColors';
import { clickFirstSwatch, createColorChangeSpy, hoverFirstSwatch, renderForSnapshot } from '../../../test/helpers';

test('Sketch renders correctly', () => {
  renderForSnapshot(<Sketch {...color.red} />).expectSnapshot();
});

test('Sketch onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Sketch onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Sketch with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Sketch onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('Sketch renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Sketch styles={{ default: { picker: { boxShadow: 'none' } } }} />);

  expect(container.firstChild.style.boxShadow).toBe('none');
});

test('SketchFields renders correctly', () => {
  renderForSnapshot(<SketchFields {...color.red} />).expectSnapshot();
});

test('SketchPresetColors renders correctly', () => {
  renderForSnapshot(<SketchPresetColors colors={['#fff', '#999', '#000']} />).expectSnapshot();
});

test('SketchPresetColors with custom titles renders correctly', () => {
  const colors = [
    {
      color: '#fff',
      title: 'white',
    },
    {
      color: '#999',
      title: 'gray',
    },
    {
      color: '#000',
    },
    '#f00',
  ];

  renderForSnapshot(<SketchPresetColors colors={colors} />).expectSnapshot();
});
