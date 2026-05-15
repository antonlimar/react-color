import { createColorChangeSpy, getRequiredElement, renderForSnapshot } from '@test/helpers';
import { fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Alpha } from './Alpha';
import { AlphaPointer } from './AlphaPointer';
import { red, simpleCheckForValidColor } from '@/helpers';

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
