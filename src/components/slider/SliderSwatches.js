import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
import SliderSwatch from './SliderSwatch';
export const SliderSwatches = ({ onClick, hsl }) => {
  const styles = reactCSS({
    default: {
      swatches: {
        marginTop: '20px',
      },
      swatch: {
        boxSizing: 'border-box',
        width: '20%',
        paddingRight: '1px',
        float: 'left',
      },
      clear: {
        clear: 'both',
      },
    },
  });
  const epsilon = 0.1;
  const offsets = [0.8, 0.65, 0.5, 0.35, 0.2];
  return _jsxs('div', {
    style: styles.swatches,
    children: [
      offsets.map((offset, index) =>
        _jsx(
          'div',
          {
            style: styles.swatch,
            children: _jsx(SliderSwatch, {
              hsl: hsl,
              offset: offset,
              active: Math.abs(hsl.l - offset) < epsilon && Math.abs(hsl.s - 0.5) < epsilon,
              onClick: onClick,
              first: index === 0,
              last: index === offsets.length - 1,
            }),
          },
          offset,
        ),
      ),
      _jsx('div', { style: styles.clear }),
    ],
  });
};
export default SliderSwatches;
