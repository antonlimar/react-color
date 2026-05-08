import { Swatch } from '@/components/common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { ColorInputChangeHandler, SwatchHoverHandler } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type PresetColor =
  | string
  | {
      color: string;
      title?: string;
    };

type SketchPresetColorsProps = {
  colors: PresetColor[];
  onClick?: ColorInputChangeHandler;
  onSwatchHover?: SwatchHoverHandler;
};

export const SketchPresetColors = ({ colors, onClick = () => {}, onSwatchHover }: SketchPresetColorsProps) => {
  const handleClick = (hex: string, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    onClick(
      {
        hex,
        source: 'hex',
      },
      event,
    );
  };

  return (
    <div
      className={getPickerClassName({
        block: 'sketch',
        slot: 'preset-colors',
        modifiers: [(!colors || colors.length === 0) && 'empty'],
        className: 'flexbox-fix',
      })}
    >
      {colors.map((colorObjOrString) => {
        const colorValue = typeof colorObjOrString === 'string' ? { color: colorObjOrString } : colorObjOrString;
        const key = `${colorValue.color}${colorValue.title || ''}`;
        return (
          <div key={key} className={getPickerClassName({ block: 'sketch', slot: 'preset-swatch' })}>
            <Swatch
              {...colorValue}
              style={{ borderRadius: '3px', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)' }}
              onClick={handleClick}
              onHover={onSwatchHover as never}
              focusStyle={{
                boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${colorValue.color}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
