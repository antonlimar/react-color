import { useCallback } from 'react';
import { pickerMetadata } from '../../content';
import { colorToHex } from '../../utils/colorUtils';
import { siteBem } from '../../utils/siteBem';
import { PickerGalleryItem } from './PickerGalleryItem';
import type { ColorResult, PickerTheme, RGBAColor } from 'react-color-x';
import './PickerGallery.scss';

interface PickerGalleryProps {
  color: RGBAColor;
  theme: PickerTheme;
  onChange: (color: ColorResult) => void;
}

export function PickerGallery({ color, theme, onChange }: PickerGalleryProps) {
  const handleGalleryColorChange = useCallback(
    (nextColor: ColorResult) => {
      onChange(nextColor);
    },
    [onChange],
  );

  const galleryColorLabel = colorToHex(color);
  const b = siteBem('picker-gallery');

  return (
    <div className={b()} aria-label="Public picker components">
      {pickerMetadata.map((picker) => (
        <PickerGalleryItem
          color={color}
          colorLabel={galleryColorLabel}
          key={picker.id}
          theme={theme}
          onChange={handleGalleryColorChange}
          picker={picker}
        />
      ))}
    </div>
  );
}
