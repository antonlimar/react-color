import { EditableInput, bem } from '@/components/common';
import type { ColorChangeValue, ColorPickerChangeEvent, RGBAColor } from '@/types';
import './CompactFields.scss';

interface CompactFieldsProps {
  hex: string;
  rgb: RGBAColor;
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
}

const b = bem('compact');

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
    <div className={b('fields')}>
      <div className={b('active')} style={{ background: hex }} />
      <div className={b('field', { hex: true })}>
        <EditableInput
          label="hex"
          value={hex}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={b('field', { rgb: true })}>
        <EditableInput
          label="r"
          value={rgb.r}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={b('field', { rgb: true })}>
        <EditableInput
          label="g"
          value={rgb.g}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={b('field', { rgb: true })}>
        <EditableInput
          label="b"
          value={rgb.b}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
    </div>
  );
}
