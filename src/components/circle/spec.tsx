import { Circle } from './Circle';
import { CircleSwatch } from './CircleSwatch';
import * as color from '../../helpers/color';
import { clickFirstSwatch, createColorChangeSpy, hoverFirstSwatch, renderForSnapshot } from '../../../test/helpers';

test('Circle renders correctly', () => {
  renderForSnapshot(<Circle />).expectSnapshot();
});

test('Circle onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Circle onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Circle with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Circle onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('Circle renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Circle styles={{ default: { card: { boxShadow: 'none' } } }} />);

  expect(container.firstChild.style.boxShadow).toBe('none');
});

test('CircleSwatch renders correctly', () => {
  renderForSnapshot(<CircleSwatch />).expectSnapshot();
});

test('CircleSwatch renders with sizing and spacing', () => {
  renderForSnapshot(<CircleSwatch circleSize={40} circleSpacing={40} />).expectSnapshot();
});
