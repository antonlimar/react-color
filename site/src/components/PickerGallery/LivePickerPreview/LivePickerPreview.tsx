import { pickerGalleryComponents, pickerGalleryPreviewProps } from '../pickerGalleryComponents';
import type { PickerMetadata } from '../../../content';
import type { ColorResult, RGBAColor } from 'react-color';
import './LivePickerPreview.scss';

interface LivePickerPreviewProps {
  picker: PickerMetadata;
  color: RGBAColor;
  onChange: (color: ColorResult) => void;
}

export function LivePickerPreview({ picker, color, onChange }: LivePickerPreviewProps) {
  const PickerComponent = pickerGalleryComponents[picker.id];

  if (!PickerComponent) {
    return null;
  }

  return (
    <div
      className={`picker-gallery__preview picker-gallery__preview--${picker.id}`}
      aria-label={`${picker.title} live demo`}
    >
      <div className="picker-gallery__live">
        <PickerComponent
          color={color}
          onChange={onChange}
          onAccept={onChange}
          {...(pickerGalleryPreviewProps[picker.id] ?? {})}
        />
      </div>
    </div>
  );
}
