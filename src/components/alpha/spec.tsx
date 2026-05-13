import { expect, test } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { red, simpleCheckForValidColor } from '@/helpers/color';

import { Alpha } from './Alpha';
import { AlphaPointer } from './AlphaPointer';
import { createColorChangeSpy, getRequiredElement, renderForSnapshot } from '@test/helpers';

test('Alpha renders correctly', () => {
  renderForSnapshot(<Alpha {...red} />).expectSnapshot();
});

test('Alpha onChange events correctly', () => {
  const changeSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Alpha {...red} width={20} height={200} onChange={changeSpy} />);

  const alphaContainer = getRequiredElement(container, '.rc-alpha-control__container');
  fireEvent.mouseDown(alphaContainer, {
    pageX: 100,
    pageY: 10,
  });
  expect(changeSpy).toHaveBeenCalled();
});

test('Alpha renders vertically', () => {
  renderForSnapshot(<Alpha {...red} width={20} height={200} direction="vertical" />).expectSnapshot();
});

test('AlphaPointer renders correctly', () => {
  renderForSnapshot(<AlphaPointer />).expectSnapshot();
});
