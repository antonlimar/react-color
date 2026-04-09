import { jsx as _jsx } from 'react/jsx-runtime';
import reactCSS from 'reactcss';
export const GooglePointer = ({ hsl = { a: 1, h: 249.94, l: 0.2, s: 0.5 } }) => {
  const styles = reactCSS({
    default: {
      picker: {
        width: '20px',
        height: '20px',
        borderRadius: '22px',
        transform: 'translate(-10px, -7px)',
        background: `hsl(${Math.round(hsl.h)}, 100%, 50%)`,
        border: '2px white solid',
      },
    },
  });
  return _jsx('div', { style: styles.picker });
};
export default GooglePointer;
