import * as color from '../../helpers/color';

import Twitter from './Twitter';
import { clickFirstSwatch, createColorChangeSpy, hoverFirstSwatch, renderForSnapshot } from '../../../test/helpers';

test('Twitter renders correctly', () => {
  renderForSnapshot(<Twitter {...color.red} />).expectSnapshot();
});

test('Material renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Twitter {...color.red} styles={{ default: { card: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(container.firstChild.style.boxShadow).toBe('0 0 10px red');
});

test('Twitter `triangle="hide"`', () => {
  renderForSnapshot(<Twitter {...color.red} triangle="hide" />).expectSnapshot();
});

test('Twitter `triangle="top-right"`', () => {
  renderForSnapshot(<Twitter {...color.red} triangle="top-right" />).expectSnapshot();
});

test('Twitter onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Twitter {...color.red} onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Twitter with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Twitter {...color.red} onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});
