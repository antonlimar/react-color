import { red, simpleCheckForValidColor } from '@/helpers/color';
import { Github } from './Github';
import { GithubSwatch } from './GithubSwatch';
import {
  clickFirstSwatch,
  createColorChangeSpy,
  getRootElement,
  hoverFirstSwatch,
  renderForSnapshot,
} from '@test/helpers';

const noop = () => {};

test('Github renders correctly', () => {
  renderForSnapshot(<Github {...red} />).expectSnapshot();
});

test('Github onChange events correctly', () => {
  const changeSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Github onChange={changeSpy} />);

  clickFirstSwatch(container);
  expect(changeSpy).toHaveBeenCalled();
});

test('Github with onSwatchHover events correctly', () => {
  const hoverSpy = createColorChangeSpy({ simpleCheckForValidColor });
  const { container } = renderForSnapshot(<Github onSwatchHover={hoverSpy} />);

  hoverFirstSwatch(container);
  expect(hoverSpy).toHaveBeenCalled();
});

test('Github `triangle="hide"`', () => {
  renderForSnapshot(<Github {...red} triangle="hide" />).expectSnapshot();
});

test('Github `triangle="top-right"`', () => {
  renderForSnapshot(<Github {...red} triangle="top-right" />).expectSnapshot();
});

test('Github renders custom styles correctly', () => {
  const { container } = renderForSnapshot(
    <Github {...red} styles={{ default: { card: { boxShadow: '0 0 10px red' } } }} />,
  );

  expect(getRootElement(container).style.boxShadow).toBe('0 0 10px red');
});

test('GithubSwatch renders correctly', () => {
  renderForSnapshot(<GithubSwatch color="#333" onClick={noop} />).expectSnapshot();
});
