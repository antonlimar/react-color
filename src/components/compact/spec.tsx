import * as color from '@/helpers/color';

import { Compact } from './Compact';
import { CompactColor } from './CompactColor';
import { CompactFields } from './CompactFields';
import {
  clickFirstSwatch,
  createColorChangeSpy,
  getRootElement,
  hoverFirstSwatch,
  renderForSnapshot,
} from '@test/helpers';

test('Compact renders correctly', () => {
  renderForSnapshot(<Compact {...color.red} />).expectSnapshot();
});

test('Compact with onSwatchHover renders correctly', () => {
  renderForSnapshot(<Compact {...color.red} onSwatchHover={() => {}} />).expectSnapshot();
});

test('Compact onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Compact {...color.red} onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Compact with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Compact {...color.red} onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('CompactColor renders correctly', () => {
  renderForSnapshot(<CompactColor />).expectSnapshot();
});

test('CompactFields renders correctly', () => {
  renderForSnapshot(<CompactFields {...color.red} />).expectSnapshot();
});

test('Compact renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Compact {...color.red} styles={{ default: { wrap: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(getRootElement(container).style.boxShadow).toBe('0 0 10px red');
});
