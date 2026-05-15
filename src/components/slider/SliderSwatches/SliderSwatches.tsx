import { SliderSwatch } from '@/components/slider/SliderSwatch';
import type { ColorInputChangeHandler, HSLAColor } from '@/types';
import { bem } from '@/components/common';
import './SliderSwatches.scss';

const b = bem('slider');

type SliderSwatchesProps = {
  onClick: ColorInputChangeHandler;
  hsl: HSLAColor;
};

export function SliderSwatches({ onClick, hsl }: SliderSwatchesProps) {
  const epsilon = 0.1;
  const offsets = [0.8, 0.65, 0.5, 0.35, 0.2];

  return (
    <div className={b('swatches').toString()}>
      {offsets.map((offset, index) => (
        <div key={offset} className={b('swatch-wrap').toString()}>
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
      <div className={b('clear').toString()} />
    </div>
  );
}
