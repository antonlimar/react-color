import type { KeyboardEvent, MouseEvent } from 'react';
import { bem } from '@/components/common';
import { SwatchesColor } from '@/components/swatches/SwatchesColor';
import type { SwatchHoverHandler } from '@/types';
import './SwatchesGroup.scss';

const b = bem('swatches');

type SwatchesGroupProps = {
  onClick: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  group: string[];
  active: string;
};

export function SwatchesGroup({ onClick, onSwatchHover, group, active }: SwatchesGroupProps) {
  return (
    <div className={b('group').toString()}>
      {group.map((colorValue: string, index: number | string) => (
        <SwatchesColor
          key={colorValue}
          color={colorValue}
          active={colorValue.toLowerCase() === active}
          first={index === 0}
          last={index === group.length - 1}
          onClick={onClick}
          onSwatchHover={onSwatchHover}
        />
      ))}
    </div>
  );
}
