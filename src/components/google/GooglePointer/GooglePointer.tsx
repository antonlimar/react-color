import type { CSSProperties } from 'react';
import type { HSLAColor } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type GooglePointerProps = {
  hsl?: HSLAColor;
};

export const GooglePointer = ({ hsl = { a: 1, h: 249.94, l: 0.2, s: 0.5 } }: GooglePointerProps) => {
  const pointerStyle: CSSProperties = {
    background: `hsl(${Math.round(hsl.h)}, 100%, 50%)`,
  };

  return <div className={getPickerClassName({ block: 'google', slot: 'pointer' })} style={pointerStyle} />;
};
