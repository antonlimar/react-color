import { noop } from 'lodash-es';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { bem } from '@/components/common';
import type { ColorInputChangeHandler, HSLAColor } from '@/types';
import './SliderSwatch.scss';

interface SliderSwatchProps {
  hsl: HSLAColor;
  offset: number;
  onClick?: ColorInputChangeHandler;
  active?: boolean;
  first?: boolean;
  last?: boolean;
}

const b = bem('slider');
const ENTER = 13;
const SPACE = 32;

export function SliderSwatch({ hsl, offset, onClick = noop, active, first, last }: SliderSwatchProps) {
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Spacebar' ||
      event.keyCode === ENTER ||
      event.keyCode === SPACE
    ) {
      event.preventDefault();
      onClick(
        {
          h: hsl.h,
          s: 0.5,
          l: offset,
          source: 'hsl',
        },
        event,
      );
    }
  };

  return (
    <div
      aria-label={`Select ${Math.round(offset * 100)}% lightness`}
      aria-pressed={active ? true : undefined}
      className={b('swatch', { active, first, last })}
      role="button"
      style={swatchStyle}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
}
