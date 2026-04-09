import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
export const PhotoshopPointer = () => {
  const styles = reactCSS({
    default: {
      triangle: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '4px 0 4px 6px',
        borderColor: 'transparent transparent transparent #fff',
        position: 'absolute',
        top: '1px',
        left: '1px',
      },
      triangleBorder: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '5px 0 5px 8px',
        borderColor: 'transparent transparent transparent #555',
      },
      left: {
        Extend: 'triangleBorder',
        transform: 'translate(-13px, -4px)',
      },
      leftInside: {
        Extend: 'triangle',
        transform: 'translate(-8px, -5px)',
      },
      right: {
        Extend: 'triangleBorder',
        transform: 'translate(20px, -14px) rotate(180deg)',
      },
      rightInside: {
        Extend: 'triangle',
        transform: 'translate(-8px, -5px)',
      },
    },
  });
  return _jsxs('div', {
    style: styles.pointer,
    children: [
      _jsx('div', { style: styles.left, children: _jsx('div', { style: styles.leftInside }) }),
      _jsx('div', { style: styles.right, children: _jsx('div', { style: styles.rightInside }) }),
    ],
  });
};
export default PhotoshopPointer;
