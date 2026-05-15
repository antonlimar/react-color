import { screen } from '@testing-library/react';
import { noop } from 'lodash-es';
import { red, simpleCheckForValidColor } from '@/helpers';
import { Google } from './Google';
import { GoogleFields } from './GoogleFields';
import { GooglePointer } from './GooglePointer';
import { GooglePointerCircle } from './GooglePointerCircle';
import { changeInputByLabel, createColorChangeSpy, getRootElement, renderForSnapshot } from '@test/helpers';

test('Google renders correctly', () => {
  renderForSnapshot(<Google {...red} />).expectSnapshot();
});

test('Google onChange events correctly', () => {
  const changeSpy = createColorChangeSpy({ simpleCheckForValidColor });
  renderForSnapshot(<Google {...red} onChange={changeSpy} />);

  changeInputByLabel('hex', '#00ff00');
  expect(changeSpy).toHaveBeenCalled();
});

test('GoogleFields renders correctly', () => {
  renderForSnapshot(<GoogleFields {...red} onChange={noop} />).expectSnapshot();
});

test('GooglePointer renders correctly', () => {
  renderForSnapshot(<GooglePointer />).expectSnapshot();
});

test('GooglePointerCircle renders correctly', () => {
  renderForSnapshot(<GooglePointerCircle />).expectSnapshot();
});

test('Google renders custom styles correctly', () => {
  const { container } = renderForSnapshot(<Google styles={{ default: { picker: { width: '200px' } } }} />);

  expect(getRootElement(container).style.width).toBe('200px');
});

test('Google renders correctly with width', () => {
  const { container } = renderForSnapshot(<Google width={200} />);

  expect(getRootElement(container).style.width).toBe('200px');
});

test('Google custom header correctly', () => {
  renderForSnapshot(<Google header="Change the color!!!" />);

  expect(screen.getByText('Change the color!!!')).toBeInTheDocument();
});
