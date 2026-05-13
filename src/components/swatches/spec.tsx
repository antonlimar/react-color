import { red, simpleCheckForValidColor } from '@/helpers/color';

import { Swatches } from './Swatches';
import { SwatchesColor } from './SwatchesColor';
import { SwatchesGroup } from './SwatchesGroup';
import {
  clickFirstSwatch,
  createColorChangeSpy,
  getRootElement,
  hoverFirstSwatch,
  renderForSnapshot,
} from '@test/helpers';

const noop = () => {};

test('Swatches renders correctly', () => {
  renderForSnapshot(<Swatches hex={red.hex} colors={[['#fff'], ['#333']]} />).expectSnapshot();
});

test('Swatches renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Swatches
      hex={red.hex}
      colors={[['#fff'], ['#333']]}
      styles={{ default: { picker: { boxShadow: '0 0 10px red' } } }}
    />,
  );

  expect(getRootElement(container).style.boxShadow).toBe('0 0 10px red');
});

test('Swatches onChange events correctly', () => {
  const changeSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Swatches onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Swatches with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Swatches onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('SwatchesColor renders correctly', () => {
  renderForSnapshot(<SwatchesColor color="#fff" />).expectSnapshot();
});

test('SwatchesColor renders with props', () => {
  renderForSnapshot(<SwatchesColor color="#fff" active first last />).expectSnapshot();
});

test('SwatchesGroup renders correctly', () => {
  renderForSnapshot(<SwatchesGroup active={red.hex} group={['#fff']} onClick={noop} />).expectSnapshot();
});
