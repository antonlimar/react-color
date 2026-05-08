import { SliderSwatch } from '../SliderSwatch';
import type { ColorInputChangeHandler, HSLAColor } from '../../../types';
import { getPickerClassName } from '../../common/styleArchitecture';

type SliderSwatchesProps = {
  onClick: ColorInputChangeHandler;
  hsl: HSLAColor;
};

export const SliderSwatches = ({ onClick, hsl }: SliderSwatchesProps) => {
  const epsilon = 0.1;
  const offsets = [0.8, 0.65, 0.5, 0.35, 0.2];

  return (
    <div className={getPickerClassName({ block: 'slider', slot: 'swatches' })}>
      {offsets.map((offset, index) => (
        <div key={offset} className={getPickerClassName({ block: 'slider', slot: 'swatch-wrap' })}>
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
      <div className={getPickerClassName({ block: 'slider', slot: 'clear' })} />
    </div>
  );
};
