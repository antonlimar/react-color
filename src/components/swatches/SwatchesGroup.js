import { jsx as _jsx } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import map from 'lodash/map';
import SwatchesColor from './SwatchesColor';
export const SwatchesGroup = ({ onClick, onSwatchHover, group, active }) => {
  const styles = reactCSS({
    default: {
      group: {
        paddingBottom: '10px',
        width: '40px',
        float: 'left',
        marginRight: '10px',
      },
    },
  });
  return _jsx('div', {
    style: styles.group,
    children: map(group, (colorValue, index) =>
      _jsx(
        SwatchesColor,
        {
          color: colorValue,
          active: colorValue.toLowerCase() === active,
          first: index === 0,
          last: index === group.length - 1,
          onClick: onClick,
          onSwatchHover: onSwatchHover,
        },
        colorValue,
      ),
    ),
  });
};
export default SwatchesGroup;
