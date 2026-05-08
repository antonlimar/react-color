import map from 'lodash/map';

import { Swatch } from '../../common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { SwatchHoverHandler } from '../../../types';
import { getPickerClassName } from '../../common/styleArchitecture';

type BlockSwatchesProps = {
  colors: string[];
  onClick: (color: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
};

export function BlockSwatches({ colors, onClick, onSwatchHover }: BlockSwatchesProps) {
  return (
    <div className={getPickerClassName({ block: 'block', slot: 'swatches' })}>
      {map(colors, (colorValue: string) => (
        <div key={colorValue} className={getPickerClassName({ block: 'block', slot: 'swatch' })}>
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
      <div className={getPickerClassName({ block: 'block', slot: 'clear' })} />
    </div>
  );
}
