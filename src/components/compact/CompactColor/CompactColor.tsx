import { getContrastingColor } from '@/helpers/color';
import { Swatch } from '@/components/common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PickerStyle, SwatchHoverHandler } from '@/types';
import { bem } from '@/components/common/styleArchitecture';

const b = bem('compact');

type CompactColorProps = {
  color: string;
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  active?: boolean;
};

export function CompactColor({ color, onClick = () => {}, onSwatchHover, active }: CompactColorProps) {
  const swatchStyle: PickerStyle = {
    background: color,
    boxShadow: color === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
  };
  const dotStyle: PickerStyle = {
    background: color === '#FFFFFF' || color === 'transparent' ? '#000' : getContrastingColor(color),
  };

  return (
    <div
      className={b('swatch', {
        active,
        white: color === '#FFFFFF',
        transparent: color === 'transparent',
      }).toString()}
    >
      <Swatch
        style={swatchStyle}
        color={color}
        onClick={onClick}
        onHover={onSwatchHover as never}
        focusStyle={{ boxShadow: `0 0 4px ${color}` }}
      >
        <div className={b('dot').toString()} style={dotStyle} />
      </Swatch>
    </div>
  );
}
