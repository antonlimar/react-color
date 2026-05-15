import './CompactFields.scss';
import { EditableInput, bem } from '@/components/common';
import type { ColorChangeValue, ColorPickerChangeEvent, RGBAColor } from '@/types';

const b = bem('compact');

type CompactFieldsProps = {
  hex: string;
  rgb: RGBAColor;
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
};

export function CompactFields({ hex, rgb, onChange }: CompactFieldsProps) {
  const handleChange = (data: ColorChangeValue, event?: ColorPickerChangeEvent) => {
    if (data.r || data.g || data.b) {
      onChange(
        {
          r: data.r || rgb.r,
          g: data.g || rgb.g,
          b: data.b || rgb.b,
          source: 'rgb',
        },
        event,
      );
    } else {
      onChange(
        {
          hex: data.hex,
          source: 'hex',
        },
        event,
      );
    }
  };

  return (
    <div className={b('fields').toString()}>
      <div className={b('active').toString()} style={{ background: hex }} />
      <div className={b('field', { hex: true }).toString()}>
        <EditableInput
          label="hex"
          value={hex}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={b('field', { rgb: true }).toString()}>
        <EditableInput
          label="r"
          value={rgb.r}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={b('field', { rgb: true }).toString()}>
        <EditableInput
          label="g"
          value={rgb.g}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={b('field', { rgb: true }).toString()}>
        <EditableInput
          label="b"
          value={rgb.b}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
    </div>
  );
}
