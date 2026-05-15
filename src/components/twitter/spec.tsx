import {
  clickFirstSwatch,
  createColorChangeSpy,
  getRootElement,
  hoverFirstSwatch,
  renderForSnapshot,
} from '@test/helpers';
import { red, simpleCheckForValidColor } from '@/helpers';
import { Twitter } from './Twitter';

test('Twitter renders correctly', () => {
  renderForSnapshot(<Twitter {...red} />).expectSnapshot();
});

test('Material renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Twitter {...red} styles={{ default: { card: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(getRootElement(container).style.boxShadow).toBe('0 0 10px red');
});

test('Twitter `triangle="hide"`', () => {
  renderForSnapshot(<Twitter {...red} triangle="hide" />).expectSnapshot();
});

test('Twitter `triangle="top-right"`', () => {
  renderForSnapshot(<Twitter {...red} triangle="top-right" />).expectSnapshot();
});

test('Twitter onChange events correctly', () => {
  const changeSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Twitter {...red} onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Twitter with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Twitter {...red} onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});
