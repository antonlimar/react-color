import { useCallback } from 'react';
import type { ColorResult, PickerTheme, RGBAColor } from '@antonlimar/react-color';
import { pickerMetadata } from '../../content';
import { colorToHex, siteBem } from '../../utils';
import { PickerGalleryItem } from './PickerGalleryItem';
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
