import { Swatch, bem } from '@/components/common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PickerStyle, SwatchHoverHandler } from '@/types';
import './GithubSwatch.scss';

const b = bem('github');

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
    <div className={b('swatch').toString()}>
      <Swatch color={color} onClick={onClick} onHover={onSwatchHover as never} focusStyle={hoverSwatch} />
    </div>
  );
}
