import { red } from '@/helpers';
import { Slider } from './Slider';
import { SliderPointer } from './SliderPointer';
import { SliderSwatch } from './SliderSwatch';
import { SliderSwatches } from './SliderSwatches';
import { getRootElement, renderForSnapshot } from '@test/helpers';

const noop = () => {};

test('Slider renders correctly', () => {
  renderForSnapshot(<Slider {...red} />).expectSnapshot();
});

test('Slider renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Slider styles={{ default: { wrap: { boxShadow: 'none' } } }} />);

  expect(getRootElement(container).style.boxShadow).toBe('none');
});

test('SliderPointer renders correctly', () => {
  renderForSnapshot(<SliderPointer />).expectSnapshot();
});

test('SliderSwatch renders correctly', () => {
  renderForSnapshot(<SliderSwatch {...red} offset={0.5} />).expectSnapshot();
});

test('SliderSwatches renders correctly', () => {
  renderForSnapshot(<SliderSwatches {...red} onClick={noop} />).expectSnapshot();
});
