import type { KeyboardEvent, MouseEvent } from 'react';
import { Swatch, bem } from '@/components/common';
import type { SwatchHoverHandler } from '@/types';
import './BlockSwatches.scss';

type BlockSwatchesProps = {
  colors: string[];
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
};

const b = bem('block');

export function BlockSwatches({ colors, onClick, onSwatchHover }: BlockSwatchesProps) {
  return (
    <div className={b('swatches').toString()}>
      {colors.map((colorValue: string) => (
        <div key={colorValue} className={b('swatch').toString()}>
          <Swatch
            color={colorValue}
            style={{ borderRadius: '4px' }}
            onClick={onClick}
            onHover={onSwatchHover as never}
            focusStyle={{
              boxShadow: `0 0 4px ${colorValue}`,
            }}
          />
        </div>
      ))}
      <div className={b('clear').toString()} />
    </div>
  );
}
