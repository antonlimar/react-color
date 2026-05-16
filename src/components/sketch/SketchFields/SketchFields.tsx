import { EditableInput, bem } from '@/components/common';
import { isValidHex } from '@/helpers';
import type { ColorChangeValue, ColorPickerChangeEvent, HSLAColor, RGBAColor } from '@/types';
import './SketchFields.scss';

interface SketchFieldsProps {
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
  rgb: RGBAColor;
  hsl: HSLAColor;
  hex: string;
  disableAlpha?: boolean;
}

const b = bem('sketch');

export function SketchFields({ onChange, rgb, hsl, hex, disableAlpha }: SketchFieldsProps) {
  const handleChange = (data: ColorChangeValue, event?: ColorPickerChangeEvent) => {
    if (data.hex) {
      if (isValidHex(data.hex)) {
        onChange(
          {
            hex: data.hex,
            source: 'hex',
          },
          event,
        );
      }
    } else if (data.r || data.g || data.b) {
      onChange(
        {
          r: data.r || rgb.r,
          g: data.g || rgb.g,
          b: data.b || rgb.b,
          a: rgb.a,
          source: 'rgb',
        },
        event,
      );
    } else if (!isNaN(Number(data.a))) {
      let alpha = Number(data.a);
      if (alpha < 0) {
        alpha = 0;
      } else if (alpha > 100) {
        alpha = 100;
      }

      onChange(
        {
          h: hsl.h,
          s: hsl.s,
          l: hsl.l,
          a: alpha / 100,
          source: 'rgb',
        },
        event,
      );
    }
  };

  const renderInput = (label: string, value: string | number, modifier: string, dragMax?: number) => (
    <div className={b('field', { [modifier]: true })}>
      <EditableInput
        label={label}
        value={value}
        onChange={(nextValue, event) => handleChange(nextValue as ColorChangeValue, event)}
        dragLabel={typeof dragMax === 'number'}
        dragMax={dragMax}
      />
    </div>
  );

  return (
    <div className={b('fields', { 'disabled-alpha': disableAlpha })}>
      {renderInput('hex', hex.replace('#', ''), 'double')}
      {renderInput('r', rgb.r, 'single', 255)}
      {renderInput('g', rgb.g, 'single', 255)}
      {renderInput('b', rgb.b, 'single', 255)}
      {renderInput('a', Math.round(rgb.a * 100), 'alpha', 100)}
    </div>
  );
}
