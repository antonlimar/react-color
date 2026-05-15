import type { KeyboardEvent, MouseEvent } from 'react';
import type { CSSProperties } from 'react';
import { noop } from 'lodash-es';
import { handleFocus } from '@/helpers';
import type { Radius } from '@/types';
import type { SwatchProps } from './types';
import { Checkboard, bem } from '@/components/common';
import './Swatch.scss';

const b = bem('swatch');

const ENTER = 13;

function SwatchBase({
  color,
  style,
  onClick = noop,
  onHover,
  title = color,
  children,
  focus,
  focusStyle = {},
}: SwatchProps) {
  const transparent = color === 'transparent';
  const swatchStyle: CSSProperties = {
    background: color,
    ...style,
    ...(focus ? focusStyle : {}),
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => onClick(color, event);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => event.keyCode === ENTER && onClick(color, event);
  const handleHover = (event: MouseEvent<HTMLDivElement>) => onHover?.(color, event);

  const optionalEvents = onHover ? { onMouseOver: handleHover } : {};

  return (
    <div
      className={b({ transparent, active: focus }).toString()}
      style={swatchStyle}
      onClick={handleClick}
      title={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...optionalEvents}
    >
      {children}
      {transparent && (
        <Checkboard borderRadius={swatchStyle.borderRadius as Radius} boxShadow="inset 0 0 0 1px rgba(0,0,0,0.1)" />
      )}
    </div>
  );
}

export const Swatch = handleFocus(SwatchBase);
