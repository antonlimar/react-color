import type { CSSProperties } from 'react';
import { bem } from '@/components/common';
import type { HSLAColor } from '@/types';
import './GooglePointerCircle.scss';

type GooglePointerCircleProps = {
  hsl?: HSLAColor;
};

const b = bem('google');

export function GooglePointerCircle({ hsl = { a: 1, h: 249.94, l: 0.2, s: 0.5 } }: GooglePointerCircleProps) {
  const pointerStyle: CSSProperties = {
    background: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`,
  };

  return <div className={b('pointer-circle').toString()} style={pointerStyle} />;
}
