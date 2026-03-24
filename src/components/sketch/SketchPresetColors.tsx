import reactCSS from 'reactcss';

import { Swatch } from '../common';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { ColorInputChangeHandler, SwatchHoverHandler } from '../../types';

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
  const styles = reactCSS(
    {
      default: {
        colors: {
          margin: '0 -10px',
          padding: '10px 0 0 10px',
          borderTop: '1px solid #eee',
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
        },
        swatchWrap: {
          width: '16px',
          height: '16px',
          margin: '0 10px 10px 0',
        },
        swatch: {
          borderRadius: '3px',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
        },
      },
      'no-presets': {
        colors: {
          display: 'none',
        },
      },
    },
    {
      'no-presets': !colors || !colors.length,
    },
  );

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
    <div style={styles.colors} className="flexbox-fix">
      {colors.map((colorObjOrString) => {
        const colorValue = typeof colorObjOrString === 'string' ? { color: colorObjOrString } : colorObjOrString;
        const key = `${colorValue.color}${colorValue.title || ''}`;
        return (
          <div key={key} style={styles.swatchWrap}>
            <Swatch
              {...colorValue}
              style={styles.swatch}
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

export default SketchPresetColors;
