import { jsx as _jsx } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import map from 'lodash/map';
import merge from 'lodash/merge';
import material from 'material-colors';
import { ColorWrap } from '../common';
import { getPickerRootProps } from '../common/styleArchitecture';
import CircleSwatch from './CircleSwatch';
const DEFAULT_CIRCLE_COLORS = [
  material.red['500'],
  material.pink['500'],
  material.purple['500'],
  material.deepPurple['500'],
  material.indigo['500'],
  material.blue['500'],
  material.lightBlue['500'],
  material.cyan['500'],
  material.teal['500'],
  material.green['500'],
  material.lightGreen['500'],
  material.lime['500'],
  material.yellow['500'],
  material.amber['500'],
  material.orange['500'],
  material.deepOrange['500'],
  material.brown['500'],
  material.blueGrey['500'],
];
export const Circle = ({
  width = 252,
  onChange,
  onSwatchHover,
  colors = DEFAULT_CIRCLE_COLORS,
  hex,
  circleSize = 28,
  styles: passedStyles = {},
  circleSpacing = 14,
  className = '',
  classNames,
  theme,
}) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          card: {
            width,
            display: 'flex',
            flexWrap: 'wrap',
            marginRight: -circleSpacing,
            marginBottom: -circleSpacing,
          },
        },
      },
      passedStyles,
    ),
  );
  return _jsx(
    'div',
    Object.assign(
      { style: styles.card },
      getPickerRootProps({
        block: 'circle',
        theme,
        className: `circle-picker ${className}`,
        classNames,
      }),
      {
        children: map(colors, (colorValue) =>
          _jsx(
            CircleSwatch,
            {
              color: colorValue,
              onClick: (hexCode, event) => onChange({ hex: hexCode, source: 'hex' }, event),
              onSwatchHover: onSwatchHover,
              active: hex === colorValue.toLowerCase(),
              circleSize: circleSize,
              circleSpacing: circleSpacing,
            },
            colorValue,
          ),
        ),
      },
    ),
  );
};
export default ColorWrap(Circle);
