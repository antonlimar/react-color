import { EditableInput, bem } from '@/components/common';
import { isValidHex } from '@/helpers';
import type { ColorChangeValue, ColorPickerChangeEvent, HSVAColor, RGBAColor } from '@/types';
import './PhotoshopFields.scss';

interface PhotoshopFieldsProps {
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
  rgb: RGBAColor;
  hsv: HSVAColor;
  hex: string;
}

const b = bem('photoshop');

export function PhotoshopFields({ onChange, rgb, hsv, hex }: PhotoshopFieldsProps) {
  const handleChange = (data: ColorChangeValue, event?: ColorPickerChangeEvent) => {
    if (data['#']) {
      if (isValidHex(data['#'])) {
        onChange(
          {
            hex: data['#'],
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
          source: 'rgb',
        },
        event,
      );
    } else if (data.h || data.s || data.v) {
      onChange(
        {
          h: data.h || hsv.h,
          s: data.s || hsv.s,
          v: data.v || hsv.v,
          source: 'hsv',
        },
        event,
      );
    }
  };

  const renderField = (label: string, value: string | number, modifier: 'rgb' | 'hex') => (
    <div className={b('field', { [modifier]: true })}>
      <EditableInput
        label={label}
        value={value}
        onChange={(nextValue, event) => handleChange(nextValue as ColorChangeValue, event)}
      />
    </div>
  );

  return (
    <div className={b('fields')}>
      {renderField('h', Math.round(hsv.h), 'rgb')}
      {renderField('s', Math.round(hsv.s * 100), 'rgb')}
      {renderField('v', Math.round(hsv.v * 100), 'rgb')}
      <div className={b('divider')} />
      {renderField('r', rgb.r, 'rgb')}
      {renderField('g', rgb.g, 'rgb')}
      {renderField('b', rgb.b, 'rgb')}
      <div className={b('divider')} />
      {renderField('#', hex.replace('#', ''), 'hex')}
      <div className={b('field-symbols')}>
        <div className={b('field-symbol')}>°</div>
        <div className={b('field-symbol')}>%</div>
        <div className={b('field-symbol')}>%</div>
      </div>
    </div>
  );
}
