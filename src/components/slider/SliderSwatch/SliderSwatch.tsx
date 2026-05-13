import type { CSSProperties, MouseEvent } from 'react';
import type { ColorInputChangeHandler, HSLAColor } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type SliderSwatchProps = {
  hsl: HSLAColor;
  offset: number;
  onClick?: ColorInputChangeHandler;
  active?: boolean;
  first?: boolean;
  last?: boolean;
};

export function SliderSwatch({ hsl, offset, onClick = () => {}, active, first, last }: SliderSwatchProps) {
  const swatchStyle: CSSProperties = {
    background: `hsl(${hsl.h}, 50%, ${offset * 100}%)`,
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick(
      {
        h: hsl.h,
        s: 0.5,
        l: offset,
        source: 'hsl',
      },
      event,
    );
  };

  return (
    <div
      className={getPickerClassName({
        block: 'slider',
        slot: 'swatch',
        modifiers: [active && 'active', first && 'first', last && 'last'],
      })}
      style={swatchStyle}
      onClick={handleClick}
    />
  );
}
