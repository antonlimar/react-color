import { Swatch } from '@/components/common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PickerStyle, SwatchHoverHandler } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type GithubSwatchProps = {
  color: string;
  onClick: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
};

export function GithubSwatch({ color, onClick, onSwatchHover }: GithubSwatchProps) {
  const hoverSwatch: PickerStyle = {
    position: 'relative',
    zIndex: '2',
    outline: '2px solid #fff',
    boxShadow: '0 0 5px 2px rgba(0,0,0,0.25)',
  };

  return (
    <div className={getPickerClassName({ block: 'github', slot: 'swatch' })}>
      <Swatch color={color} onClick={onClick} onHover={onSwatchHover as never} focusStyle={hoverSwatch} />
    </div>
  );
}
