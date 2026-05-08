import { red } from '../../helpers/color';

import { Material } from './Material';
import { renderForSnapshot } from '../../../test/helpers';

test('Material renders correctly', () => {
  renderForSnapshot(<Material {...red} />).expectSnapshot();
});

test('Material renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Material {...red} styles={{ default: { wrap: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(container.firstChild.style.boxShadow).toBe('0 0 10px red');
});
