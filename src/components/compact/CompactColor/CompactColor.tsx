import { noop } from 'lodash-es';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Swatch, bem } from '@/components/common';
import { getContrastingColor } from '@/helpers';
import type { PickerStyle, SwatchHoverHandler } from '@/types';
import './CompactColor.scss';

type CompactColorProps = {
  color: string;
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  active?: boolean;
};

const b = bem('compact');

export function CompactColor({ color, onClick = noop, onSwatchHover, active }: CompactColorProps) {
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
      })}
    >
      <Swatch
        style={swatchStyle}
        color={color}
        onClick={onClick}
        onHover={onSwatchHover as never}
        focusStyle={{ boxShadow: `0 0 4px ${color}` }}
      >
        <div className={b('dot')} style={dotStyle} />
      </Swatch>
    </div>
  );
}
