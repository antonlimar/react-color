import { EditableInput } from '../common';
import { getPickerClassName } from '../common/styleArchitecture';
import type { ColorChangeValue, ColorPickerChangeEvent, RGBAColor } from '../../types';

type CompactFieldsProps = {
  hex: string;
  rgb: RGBAColor;
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
};

export const CompactFields = ({ hex, rgb, onChange }: CompactFieldsProps) => {
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
    <div className={getPickerClassName({ block: 'compact', slot: 'fields', className: 'flexbox-fix' })}>
      <div className={getPickerClassName({ block: 'compact', slot: 'active' })} style={{ background: hex }} />
      <div className={getPickerClassName({ block: 'compact', slot: 'field', modifiers: ['hex'] })}>
        <EditableInput
          label="hex"
          value={hex}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={getPickerClassName({ block: 'compact', slot: 'field', modifiers: ['rgb'] })}>
        <EditableInput
          label="r"
          value={rgb.r}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={getPickerClassName({ block: 'compact', slot: 'field', modifiers: ['rgb'] })}>
        <EditableInput
          label="g"
          value={rgb.g}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
      <div className={getPickerClassName({ block: 'compact', slot: 'field', modifiers: ['rgb'] })}>
        <EditableInput
          label="b"
          value={rgb.b}
          onChange={(value, event) => handleChange(value as ColorChangeValue, event)}
        />
      </div>
    </div>
  );
};

export default CompactFields;
