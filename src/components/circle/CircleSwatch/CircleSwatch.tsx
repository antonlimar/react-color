import type { KeyboardEvent, MouseEvent } from 'react';
import { Swatch, bem } from '@/components/common';
import type { PickerStyle, SwatchHoverHandler } from '@/types';
import './CircleSwatch.scss';

interface CircleSwatchProps {
  color: string;
  onClick: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  hover?: boolean;
  active?: boolean;
  circleSize?: number;
  circleSpacing?: number;
}

const b = bem('circle');

export function CircleSwatch({
  color,
  onClick,
  onSwatchHover,
  hover,
  active,
  circleSize = 28,
  circleSpacing = 14,
}: CircleSwatchProps) {
  const wrapperStyle: PickerStyle = {
    width: circleSize,
    height: circleSize,
    marginRight: circleSpacing,
    marginBottom: circleSpacing,
  };

  const circleStyle: PickerStyle = {
    borderRadius: '50%',
    background: 'transparent',
    boxShadow: active ? `inset 0 0 0 3px ${color}` : `inset 0 0 0 ${circleSize / 2 + 1}px ${color}`,
  };

  return (
    <div className={b('swatch', { hover, active })} style={wrapperStyle}>
      <Swatch
        style={circleStyle}
        color={color}
        onClick={onClick}
        onHover={onSwatchHover as never}
        focusStyle={{ boxShadow: `${circleStyle.boxShadow || 'none'}, 0 0 5px ${color}` }}
      />
    </div>
  );
}
