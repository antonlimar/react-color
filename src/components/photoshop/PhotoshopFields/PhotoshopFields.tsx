import { isValidHex } from '@/helpers/color';

import { EditableInput } from '@/components/common';
import { getPickerClassName } from '@/components/common/styleArchitecture';
import type { ColorChangeValue, ColorPickerChangeEvent, HSVAColor, RGBAColor } from '@/types';

type PhotoshopFieldsProps = {
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
  rgb: RGBAColor;
  hsv: HSVAColor;
  hex: string;
};

export const PhotoshopFields = ({ onChange, rgb, hsv, hex }: PhotoshopFieldsProps) => {
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
    <div className={getPickerClassName({ block: 'photoshop', slot: 'field', modifiers: [modifier] })}>
      <EditableInput
        label={label}
        value={value}
        onChange={(nextValue, event) => handleChange(nextValue as ColorChangeValue, event)}
      />
    </div>
  );

  return (
    <div className={getPickerClassName({ block: 'photoshop', slot: 'fields' })}>
      {renderField('h', Math.round(hsv.h), 'rgb')}
      {renderField('s', Math.round(hsv.s * 100), 'rgb')}
      {renderField('v', Math.round(hsv.v * 100), 'rgb')}
      <div className={getPickerClassName({ block: 'photoshop', slot: 'divider' })} />
      {renderField('r', rgb.r, 'rgb')}
      {renderField('g', rgb.g, 'rgb')}
      {renderField('b', rgb.b, 'rgb')}
      <div className={getPickerClassName({ block: 'photoshop', slot: 'divider' })} />
      {renderField('#', hex.replace('#', ''), 'hex')}
      <div className={getPickerClassName({ block: 'photoshop', slot: 'field-symbols' })}>
        <div className={getPickerClassName({ block: 'photoshop', slot: 'field-symbol' })}>°</div>
        <div className={getPickerClassName({ block: 'photoshop', slot: 'field-symbol' })}>%</div>
        <div className={getPickerClassName({ block: 'photoshop', slot: 'field-symbol' })}>%</div>
      </div>
    </div>
  );
};
