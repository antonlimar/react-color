import * as colorUtils from '../../helpers/color';

import { Swatch } from '../common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PickerStyle, SwatchHoverHandler } from '../../types';
import { getPickerClassName } from '../common/styleArchitecture';

type CompactColorProps = {
  color: string;
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  active?: boolean;
};

export const CompactColor = ({ color, onClick = () => {}, onSwatchHover, active }: CompactColorProps) => {
  const swatchStyle: PickerStyle = {
    background: color,
    boxShadow: color === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
  };
  const dotStyle: PickerStyle = {
    background: color === '#FFFFFF' || color === 'transparent' ? '#000' : colorUtils.getContrastingColor(color),
  };

  return (
    <div
      className={getPickerClassName({
        block: 'compact',
        slot: 'swatch',
        modifiers: [active && 'active', color === '#FFFFFF' && 'white', color === 'transparent' && 'transparent'],
      })}
    >
      <Swatch
        style={swatchStyle}
        color={color}
        onClick={onClick}
        onHover={onSwatchHover as never}
        focusStyle={{ boxShadow: `0 0 4px ${color}` }}
      >
        <div className={getPickerClassName({ block: 'compact', slot: 'dot' })} style={dotStyle} />
      </Swatch>
    </div>
  );
};

export default CompactColor;
