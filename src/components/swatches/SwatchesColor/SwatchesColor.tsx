import { getContrastingColor } from '@/helpers/color';
import { Swatch } from '@/components/common';
import { CheckIcon } from '@/components/common/icons/CheckIcon';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PickerStyle, SwatchHoverHandler } from '@/types';
import { bem } from '@/components/common/styleArchitecture';

const b = bem('swatches');

type SwatchesColorProps = {
  color: string;
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  first?: boolean;
  last?: boolean;
  active?: boolean;
};

export function SwatchesColor({ color, onClick = () => {}, onSwatchHover, first, last, active }: SwatchesColorProps) {
  const swatchStyle: PickerStyle = {
    background: color,
    overflow: 'hidden',
    borderRadius: first ? '2px 2px 0 0' : last ? '0 0 2px 2px' : undefined,
    boxShadow: color === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
  };
  const checkStyle: PickerStyle = {
    color: color === '#FFFFFF' || color === 'transparent' ? '#333' : getContrastingColor(color),
  };

  return (
    <div
      className={b('swatch', {
        first,
        last,
        active,
        white: color === '#FFFFFF',
        transparent: color === 'transparent',
      }).toString()}
    >
      <Swatch
        color={color}
        style={swatchStyle}
        onClick={onClick}
        onHover={onSwatchHover as never}
        focusStyle={{ boxShadow: `0 0 4px ${color}` }}
      >
        <div className={b('check').toString()} style={checkStyle}>
          <CheckIcon />
        </div>
      </Swatch>
    </div>
  );
}
