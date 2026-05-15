import type { CSSProperties } from 'react';
import { bem } from '@/components/common';
import type { HSLAColor } from '@/types';
import './GooglePointer.scss';

const b = bem('google');

type GooglePointerProps = {
  hsl?: HSLAColor;
};

export function GooglePointer({ hsl = { a: 1, h: 249.94, l: 0.2, s: 0.5 } }: GooglePointerProps) {
  const pointerStyle: CSSProperties = {
    background: `hsl(${Math.round(hsl.h)}, 100%, 50%)`,
  };

  return <div className={b('pointer').toString()} style={pointerStyle} />;
}
