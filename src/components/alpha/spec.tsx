import { fireEvent } from '@testing-library/react';
import * as color from '../../helpers/color';

import Alpha from './Alpha';
import AlphaPointer from './AlphaPointer';
import { createColorChangeSpy, renderForSnapshot } from '../../../test/helpers';

test('Alpha renders correctly', () => {
  renderForSnapshot(<Alpha {...color.red} />).expectSnapshot();
});

test('Alpha onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Alpha {...color.red} width={20} height={200} onChange={changeSpy} />);

  const alphaContainer = container.querySelector('[style*="margin: 0px 3px"]');

  expect(alphaContainer).toBeTruthy();
  fireEvent.mouseDown(alphaContainer, {
    pageX: 100,
    pageY: 10,
  });
  expect(changeSpy).toHaveBeenCalled();
});

test('Alpha renders vertically', () => {
  renderForSnapshot(<Alpha {...color.red} width={20} height={200} direction="vertical" />).expectSnapshot();
});

test('AlphaPointer renders correctly', () => {
  renderForSnapshot(<AlphaPointer />).expectSnapshot();
});
