import map from 'lodash/map';

import SwatchesColor from './SwatchesColor';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { SwatchHoverHandler } from '../../types';
import { getPickerClassName } from '../common/styleArchitecture';

type SwatchesGroupProps = {
  onClick: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
  group: string[];
  active: string;
};

export const SwatchesGroup = ({ onClick, onSwatchHover, group, active }: SwatchesGroupProps) => {
  return (
    <div className={getPickerClassName({ block: 'swatches', slot: 'group' })}>
      {map(group, (colorValue: string, index: number | string) => (
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
};

export default SwatchesGroup;
