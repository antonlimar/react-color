import { red } from '../../helpers/color';

import Photoshop from './Photoshop';
import PhotoshopButton from './PhotoshopButton';
import PhotoshopFields from './PhotoshopFields';
import PhotoshopPointer from './PhotoshopPointer';
import PhotoshopPointerCircle from './PhotoshopPointerCircle';
import PhotoshopPreviews from './PhotoshopPreviews';
import { renderForSnapshot } from '../../../test/helpers';

test('Photoshop renders correctly', () => {
  renderForSnapshot(<Photoshop {...red} onAccept={() => {}} onCancel={() => {}} />).expectSnapshot();
});

test('Photoshop renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Photoshop {...red} styles={{ default: { picker: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(container.firstChild.style.boxShadow).toBe('0 0 10px red');
});

test('PhotoshopButton renders correctly', () => {
  renderForSnapshot(<PhotoshopButton label="accept" onClick={() => {}} />).expectSnapshot();
});

test('PhotoshopFields renders correctly', () => {
  renderForSnapshot(<PhotoshopFields {...red} />).expectSnapshot();
});

test('PhotoshopPointer renders correctly', () => {
  renderForSnapshot(<PhotoshopPointer />).expectSnapshot();
});

test('PhotoshopPointerCircle renders correctly', () => {
  renderForSnapshot(<PhotoshopPointerCircle {...red} />).expectSnapshot();
});

test('PhotoshopPreviews renders correctly', () => {
  renderForSnapshot(<PhotoshopPreviews {...red} currencColor="#aeee00" />).expectSnapshot();
});
