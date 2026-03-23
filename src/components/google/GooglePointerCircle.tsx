import React from 'react';
import reactCSS from 'reactcss';
import type { HSLAColor } from '../../types';

type GooglePointerCircleProps = {
  hsl?: HSLAColor;
};

export const GooglePointerCircle = ({ hsl = { a: 1, h: 249.94, l: 0.2, s: 0.5 } }: GooglePointerCircleProps) => {
  const styles = reactCSS({
    default: {
      picker: {
        width: '20px',
        height: '20px',
        borderRadius: '22px',
        border: '2px #fff solid',
        transform: 'translate(-12px, -13px)',
        background: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`,
      },
    },
  });

  return <div style={styles.picker} />;
};

GooglePointerCircle.defaultProps = {
  hsl: { a: 1, h: 249.94, l: 0.2, s: 0.5 },
};

export default GooglePointerCircle;
