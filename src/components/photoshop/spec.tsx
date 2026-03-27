import { fireEvent, screen } from '@testing-library/react';
import { red } from '../../helpers/color';
import { expect, test, vi } from 'vitest';

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
  const root = container.firstElementChild;

  expect(root).toBeInstanceOf(HTMLElement);
  expect(root).toHaveStyle({ boxShadow: '0 0 10px red' });
});

test('PhotoshopButton renders correctly', () => {
  renderForSnapshot(<PhotoshopButton label="accept" onClick={() => {}} />).expectSnapshot();
});

test('PhotoshopFields renders correctly', () => {
  renderForSnapshot(<PhotoshopFields {...red} onChange={() => {}} />).expectSnapshot();
});

test('PhotoshopPointer renders correctly', () => {
  renderForSnapshot(<PhotoshopPointer />).expectSnapshot();
});

test('PhotoshopPointerCircle renders correctly', () => {
  renderForSnapshot(<PhotoshopPointerCircle {...red} />).expectSnapshot();
});

test('PhotoshopPreviews renders correctly', () => {
  renderForSnapshot(<PhotoshopPreviews {...red} currentColor="#aeee00" />).expectSnapshot();
});

test('Photoshop keeps header and styles runtime defaults', () => {
  const { container } = renderForSnapshot(<Photoshop {...red} />);
  const root = container.firstElementChild;

  expect(screen.getByText('Color Picker')).toBeInTheDocument();
  expect(root).toBeInstanceOf(HTMLElement);
  expect(root).toHaveStyle({ boxShadow: '0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)' });
});

test('Photoshop passes resolved defaults to onAccept', () => {
  const onAccept = vi.fn();

  renderForSnapshot(<Photoshop {...red} onAccept={onAccept} />);

  fireEvent.click(screen.getByText('OK'));

  expect(onAccept).toHaveBeenCalledTimes(1);
  expect(onAccept.mock.calls[0][0]).toMatchObject({
    header: 'Color Picker',
    styles: {},
  });
});
