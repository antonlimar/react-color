import React from 'react';
import * as color from '../../helpers/color';

import Github from './Github';
import GithubSwatch from './GithubSwatch';
import { clickFirstSwatch, createColorChangeSpy, hoverFirstSwatch, renderForSnapshot } from '../../../test/helpers';

test('Github renders correctly', () => {
  renderForSnapshot(<Github {...color.red} />).expectSnapshot();
});

test('Github onChange events correctly', () => {
  const changeSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Github onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Github with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy(color);
  const { container } = renderForSnapshot(<Github onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('Github `triangle="hide"`', () => {
  renderForSnapshot(<Github {...color.red} triangle="hide" />).expectSnapshot();
});

test('Github `triangle="top-right"`', () => {
  renderForSnapshot(<Github {...color.red} triangle="top-right" />).expectSnapshot();
});

test('Github renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Github {...color.red} styles={{ default: { card: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(container.firstChild.style.boxShadow).toBe('0 0 10px red');
});

test('GithubSwatch renders correctly', () => {
  renderForSnapshot(<GithubSwatch color="#333" />).expectSnapshot();
});
