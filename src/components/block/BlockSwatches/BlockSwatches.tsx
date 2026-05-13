import { Swatch } from '@/components/common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { SwatchHoverHandler } from '@/types';
import { bem } from '@/components/common/styleArchitecture';

const b = bem('block');

type BlockSwatchesProps = {
  colors: string[];
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
};

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
