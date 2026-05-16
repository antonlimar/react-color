import type { KeyboardEvent, MouseEvent } from 'react';
import { bem } from '@/components/common';
import type { SwatchHoverHandler } from '@/types';
import { SwatchesColor } from '../SwatchesColor';
import './SwatchesGroup.scss';

interface SwatchesGroupProps {
  onClick: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  group: string[];
  active: string;
}

const b = bem('swatches');

export function SwatchesGroup({ onClick, onSwatchHover, group, active }: SwatchesGroupProps) {
  return (
    <div className={b('group')}>
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
