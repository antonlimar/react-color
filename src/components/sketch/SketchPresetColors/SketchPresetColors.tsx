import { noop } from 'lodash-es';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Swatch, bem } from '@/components/common';
import type { ColorInputChangeHandler, SwatchHoverHandler } from '@/types';
import './SketchPresetColors.scss';

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

const b = bem('sketch');

export function SketchPresetColors({ colors, onClick = noop, onSwatchHover }: SketchPresetColorsProps) {
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
    <div className={b('preset-colors', { empty: !colors || colors.length === 0 }).toString()}>
      {colors.map((colorObjOrString) => {
        const colorValue = typeof colorObjOrString === 'string' ? { color: colorObjOrString } : colorObjOrString;
        const key = `${colorValue.color}${colorValue.title || ''}`;
        return (
          <div key={key} className={b('preset-swatch').toString()}>
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
}
