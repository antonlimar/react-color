import reactCSS from 'reactcss';

import SliderSwatch from './SliderSwatch';
import type { ColorInputChangeHandler, HSLAColor } from '../../types';

type SliderSwatchesProps = {
  onClick: ColorInputChangeHandler;
  hsl: HSLAColor;
};

export const SliderSwatches = ({ onClick, hsl }: SliderSwatchesProps) => {
  const styles = reactCSS({
    default: {
      swatches: {
        marginTop: '20px',
      },
      swatch: {
        boxSizing: 'border-box',
        width: '20%',
        paddingRight: '1px',
        float: 'left',
      },
      clear: {
        clear: 'both',
      },
    },
  });

  const epsilon = 0.1;
  const offsets = [0.8, 0.65, 0.5, 0.35, 0.2];

  return (
    <div style={styles.swatches}>
      {offsets.map((offset, index) => (
        <div key={offset} style={styles.swatch}>
          <SliderSwatch
            hsl={hsl}
            offset={offset}
            active={Math.abs(hsl.l - offset) < epsilon && Math.abs(hsl.s - 0.5) < epsilon}
            onClick={onClick}
            first={index === 0}
            last={index === offsets.length - 1}
          />
        </div>
      ))}
      <div style={styles.clear} />
    </div>
  );
};

export default SliderSwatches;
