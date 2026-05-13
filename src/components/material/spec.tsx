import { red } from '@/helpers';
import { Material } from './Material';
import { getRootElement, renderForSnapshot } from '@test/helpers';

test('Material renders correctly', () => {
  renderForSnapshot(<Material {...red} />).expectSnapshot();
});

test('Material renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Material {...red} styles={{ default: { wrap: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(getRootElement(container).style.boxShadow).toBe('0 0 10px red');
});
