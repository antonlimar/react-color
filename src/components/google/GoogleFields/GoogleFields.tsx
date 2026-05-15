import { isValidColorString, isValidHex } from '@/helpers';
import { EditableInput, bem } from '@/components/common';
import type { ColorChangeValue, ColorPickerChangeEvent, HSLAColor, HSVAColor, RGBAColor } from '@/types';
import './GoogleFields.scss';

const b = bem('google');

type GoogleFieldsProps = {
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
  rgb: RGBAColor;
  hsl: HSLAColor;
  hex: string;
  hsv: HSVAColor;
};

const normalizeAngleValue = (value: string) => value.replace('°', '');
const normalizePercentValue = (value: string) => value.replace('%', '');

export function GoogleFields({ onChange, rgb, hsl, hex, hsv }: GoogleFieldsProps) {
  const handleChange = (data: ColorChangeValue, event?: ColorPickerChangeEvent) => {
    if (typeof data.hex === 'string') {
      if (isValidHex(data.hex)) {
        onChange(
          {
            hex: data.hex,
            source: 'hex',
          },
          event,
        );
      }
    } else if (typeof data.rgb === 'string') {
      const values = data.rgb.split(',');
      if (isValidColorString(data.rgb, 'rgb')) {
        onChange(
          {
            r: Number(values[0]),
            g: Number(values[1]),
            b: Number(values[2]),
            a: 1,
            source: 'rgb',
          },
          event,
        );
      }
    } else if (typeof data.hsv === 'string') {
      const values = data.hsv.split(',');
      if (isValidColorString(data.hsv, 'hsv')) {
        const normalizedHsv = [
          normalizeAngleValue(values[0]),
          normalizePercentValue(values[1]),
          normalizePercentValue(values[2]),
        ];
        if (normalizedHsv[1] === '1') {
          normalizedHsv[1] = '0.01';
        } else if (normalizedHsv[2] === '1') {
          normalizedHsv[2] = '0.01';
        }
        onChange(
          {
            h: Number(normalizedHsv[0]),
            s: Number(normalizedHsv[1]),
            v: Number(normalizedHsv[2]),
            source: 'hsv',
          },
          event,
        );
      }
    } else if (typeof data.hsl === 'string') {
      const values = data.hsl.split(',');
      if (isValidColorString(data.hsl, 'hsl')) {
        const normalizedHsl = [
          normalizeAngleValue(values[0]),
          normalizePercentValue(values[1]),
          normalizePercentValue(values[2]),
        ];
        if (normalizedHsl[1] === '1') {
          normalizedHsl[1] = '0.01';
        } else if (normalizedHsl[2] === '1') {
          normalizedHsl[2] = '0.01';
        }
        onChange(
          {
            h: Number(normalizedHsl[0]),
            s: Number(normalizedHsl[1]),
            l: Number(normalizedHsl[2]),
            source: 'hsl',
          },
          event,
        );
      }
    }
  };

  const rgbValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  const hslValue = `${Math.round(hsl.h)}°, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%`;
  const hsvValue = `${Math.round(hsv.h)}°, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%`;

  return (
    <div className={b('fields').toString()}>
      <div className={b('fields-body').toString()}>
        <div className={b('field-row', { primary: true }).toString()}>
          <EditableInput
            label="hex"
            value={hex}
            onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
          />
        </div>
        <div className={b('field-row', { secondary: true }).toString()}>
          <div className={b('field').toString()}>
            <EditableInput
              label="rgb"
              value={rgbValue}
              onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
            />
          </div>
          <div className={b('field').toString()}>
            <EditableInput
              label="hsv"
              value={hsvValue}
              onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
            />
          </div>
          <div className={b('field').toString()}>
            <EditableInput
              label="hsl"
              value={hslValue}
              onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
