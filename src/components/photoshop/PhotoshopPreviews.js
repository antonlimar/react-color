import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
export const PhotoshopPreviews = ({ rgb, currentColor }) => {
  const styles = reactCSS({
    default: {
      swatches: {
        border: '1px solid #B3B3B3',
        borderBottom: '1px solid #F0F0F0',
        marginBottom: '2px',
        marginTop: '1px',
      },
      new: {
        height: '34px',
        background: `rgb(${rgb.r},${rgb.g}, ${rgb.b})`,
        boxShadow: 'inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000',
      },
      current: {
        height: '34px',
        background: currentColor,
        boxShadow: 'inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000',
      },
      label: {
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
      },
    },
  });
  return _jsxs('div', {
    children: [
      _jsx('div', { style: styles.label, children: 'new' }),
      _jsxs('div', {
        style: styles.swatches,
        children: [_jsx('div', { style: styles.new }), _jsx('div', { style: styles.current })],
      }),
      _jsx('div', { style: styles.label, children: 'current' }),
    ],
  });
};
export default PhotoshopPreviews;
