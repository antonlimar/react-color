import { siteBem } from '../../../utils/siteBem';
import { pickerGalleryComponents, pickerGalleryPreviewProps } from '../pickerGalleryComponents';
import type { PickerMetadata } from '../../../content';
import type { ColorResult, PickerTheme, RGBAColor } from 'react-color-x';
import './LivePickerPreview.scss';

interface LivePickerPreviewProps {
  picker: PickerMetadata;
  color: RGBAColor;
  theme: PickerTheme;
  onChange: (color: ColorResult) => void;
}

export function LivePickerPreview({ picker, color, theme, onChange }: LivePickerPreviewProps) {
  const PickerComponent = pickerGalleryComponents[picker.id];

  if (!PickerComponent) {
    return null;
  }

  const b = siteBem('picker-gallery');

  return (
    <div className={b('preview', { [picker.id]: true })} aria-label={`${picker.title} live demo`}>
      <div className={b('live')}>
        <PickerComponent
          color={color}
          theme={theme}
          onChange={onChange}
          onAccept={onChange}
          {...(pickerGalleryPreviewProps[picker.id] ?? {})}
        />
      </div>
    </div>
  );
}
