import { noop } from 'lodash-es';
import type { CSSProperties, MouseEvent } from 'react';
import { bem } from '@/components/common';
import type { ColorInputChangeHandler, HSLAColor } from '@/types';
import './SliderSwatch.scss';

type SliderSwatchProps = {
  hsl: HSLAColor;
  offset: number;
  onClick?: ColorInputChangeHandler;
  active?: boolean;
  first?: boolean;
  last?: boolean;
};

const b = bem('slider');

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

  return <div className={b('swatch', { active, first, last }).toString()} style={swatchStyle} onClick={handleClick} />;
}
