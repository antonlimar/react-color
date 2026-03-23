import React from 'react';
import reactCSS from 'reactcss';
import map from 'lodash/map';

import { Swatch } from '../common';
import type { SwatchHoverHandler } from '../../types';

type BlockSwatchesProps = {
  colors: string[];
  onClick: (color: string, event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
  onSwatchHover?: SwatchHoverHandler;
};

export const BlockSwatches = ({ colors, onClick, onSwatchHover }: BlockSwatchesProps) => {
  const styles = reactCSS({
    default: {
      swatches: {
        marginRight: '-10px',
      },
      swatch: {
        width: '22px',
        height: '22px',
        float: 'left',
        marginRight: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
      },
      clear: {
        clear: 'both',
      },
    },
  });

  return (
    <div style={styles.swatches}>
      {map(colors, (colorValue: string) => (
        <Swatch
          key={colorValue}
          color={colorValue}
          style={styles.swatch}
          onClick={onClick}
          onHover={onSwatchHover as never}
          focusStyle={{
            boxShadow: `0 0 4px ${colorValue}`,
          }}
        />
      ))}
      <div style={styles.clear} />
    </div>
  );
};

export default BlockSwatches;
