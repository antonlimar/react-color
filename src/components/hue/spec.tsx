import { red } from '../../helpers/color';

import Hue from './Hue';
import HuePointer from './HuePointer';
import { renderForSnapshot } from '../../../test/helpers';

test('Hue renders correctly', () => {
  renderForSnapshot(<Hue {...red} />).expectSnapshot();
});

test('Hue renders vertically', () => {
  renderForSnapshot(<Hue {...red} width={20} height={200} direction="vertical" />).expectSnapshot();
});

test('Hue renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Hue {...red} styles={{ default: { picker: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(container.firstChild.style.boxShadow).toBe('0 0 10px red');
});

test('HuePointer renders correctly', () => {
  renderForSnapshot(<HuePointer />).expectSnapshot();
});
