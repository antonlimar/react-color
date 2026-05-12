import * as color from '@/helpers/color';
import { expect, test } from 'vitest';

import { Sketch } from './Sketch';
import { SketchFields } from './SketchFields';
import { SketchPresetColors } from './SketchPresetColors';
import {
  clickFirstSwatch,
  createColorChangeSpy,
  getRootElement,
  hoverFirstSwatch,
  renderForSnapshot,
} from '@test/helpers';

const noop = () => {};

test('Sketch renders correctly', () => {
  renderForSnapshot(<Sketch {...color.red} />).expectSnapshot();
});

test('Sketch renders correctly in dark theme', () => {
  renderForSnapshot(<Sketch {...color.red} theme="dark" />).expectSnapshot();
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

  expect(getRootElement(container).style.boxShadow).toBe('none');
});

test('Sketch applies public theme and root classNames without breaking legacy className', () => {
  const { container } = renderForSnapshot(
    <Sketch theme="light" className="legacy-root" classNames={{ root: 'consumer-root' }} disableAlpha />,
  );
  const picker = getRootElement(container);

  expect(picker.className).toContain('rc-sketch');
  expect(picker.className).toContain('rc-sketch--light');
  expect(picker.className).toContain('rc-sketch--disabled-alpha');
  expect(picker.className).toContain('sketch-picker');
  expect(picker.className).toContain('legacy-root');
  expect(picker.className).toContain('consumer-root');
});

test('SketchFields renders correctly', () => {
  renderForSnapshot(<SketchFields {...color.red} onChange={noop} />).expectSnapshot();
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
