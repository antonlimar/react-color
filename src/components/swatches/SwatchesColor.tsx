import * as colorUtils from '../../helpers/color';

import { Swatch } from '../common';
import { CheckIcon } from '../common/icons/CheckIcon';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PickerStyle, SwatchHoverHandler } from '../../types';
import { getPickerClassName } from '../common/styleArchitecture';

type SwatchesColorProps = {
  color: string;
  onClick?: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  first?: boolean;
  last?: boolean;
  active?: boolean;
};

export const SwatchesColor = ({
  color,
  onClick = () => {},
  onSwatchHover,
  first,
  last,
  active,
}: SwatchesColorProps) => {
  const swatchStyle: PickerStyle = {
    background: color,
    overflow: 'hidden',
    borderRadius: first ? '2px 2px 0 0' : last ? '0 0 2px 2px' : undefined,
    boxShadow: color === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
  };
  const checkStyle: PickerStyle = {
    color: color === '#FFFFFF' || color === 'transparent' ? '#333' : colorUtils.getContrastingColor(color),
  };

  return (
    <div
      className={getPickerClassName({
        block: 'swatches',
        slot: 'swatch',
        modifiers: [
          first && 'first',
          last && 'last',
          active && 'active',
          color === '#FFFFFF' && 'white',
          color === 'transparent' && 'transparent',
        ],
      })}
    >
      <Swatch
        color={color}
        style={swatchStyle}
        onClick={onClick}
        onHover={onSwatchHover as never}
        focusStyle={{ boxShadow: `0 0 4px ${color}` }}
      >
        <div className={getPickerClassName({ block: 'swatches', slot: 'check' })} style={checkStyle}>
          <CheckIcon />
        </div>
      </Swatch>
    </div>
  );
};

export default SwatchesColor;
