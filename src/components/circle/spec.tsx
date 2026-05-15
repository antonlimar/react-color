import {
  clickFirstSwatch,
  createColorChangeSpy,
  getRootElement,
  hoverFirstSwatch,
  renderForSnapshot,
} from '@test/helpers';
import { noop } from 'lodash-es';
import { Circle } from './Circle';
import { CircleSwatch } from './CircleSwatch';
import { simpleCheckForValidColor } from '@/helpers';

test('Circle renders correctly', () => {
  renderForSnapshot(<Circle />).expectSnapshot();
});

test('Circle onChange events correctly', () => {
  const changeSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Circle onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Circle with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Circle onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('Circle renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Circle styles={{ default: { card: { boxShadow: 'none' } } }} />);

  expect(getRootElement(container).style.boxShadow).toBe('none');
});

test('CircleSwatch renders correctly', () => {
  renderForSnapshot(<CircleSwatch color="#fff" onClick={noop} />).expectSnapshot();
});

test('CircleSwatch renders with sizing and spacing', () => {
  renderForSnapshot(<CircleSwatch color="#fff" circleSize={40} circleSpacing={40} onClick={noop} />).expectSnapshot();
});
