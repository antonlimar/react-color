import type { CSSProperties } from 'react';
import type { HSLAColor } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type GooglePointerCircleProps = {
  hsl?: HSLAColor;
};

export function GooglePointerCircle({ hsl = { a: 1, h: 249.94, l: 0.2, s: 0.5 } }: GooglePointerCircleProps) {
  const pointerStyle: CSSProperties = {
    background: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`,
  };

  return <div className={getPickerClassName({ block: 'google', slot: 'pointer-circle' })} style={pointerStyle} />;
}
