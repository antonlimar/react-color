import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import map from 'lodash/map';
import { Swatch } from '../common';
export const BlockSwatches = ({ colors, onClick, onSwatchHover }) => {
  const styles = reactCSS({
    default: {
      swatches: {
        marginRight: '-10px',
      },
      swatch: {
        width: '22px',
        height: '22px',
        float: 'left',
        marginRight: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
      },
      clear: {
        clear: 'both',
      },
    },
  });
  return _jsxs('div', {
    style: styles.swatches,
    children: [
      map(colors, (colorValue) =>
        _jsx(
          Swatch,
          {
            color: colorValue,
            style: styles.swatch,
            onClick: onClick,
            onHover: onSwatchHover,
            focusStyle: {
              boxShadow: `0 0 4px ${colorValue}`,
            },
          },
          colorValue,
        ),
      ),
      _jsx('div', { style: styles.clear }),
    ],
  });
};
export default BlockSwatches;
