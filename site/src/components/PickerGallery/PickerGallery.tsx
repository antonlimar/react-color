import { useCallback } from 'react';
import { pickerMetadata } from '../../content';
import { colorToHex } from '../../utils/colorUtils';
import { siteBem } from '../../utils/siteBem';
import { PickerGalleryItem } from './PickerGalleryItem';
import type { ColorResult, RGBAColor } from 'react-color';
import './PickerGallery.scss';

interface PickerGalleryProps {
  color: RGBAColor;
  onChange: (color: ColorResult) => void;
}

export function PickerGallery({ color, onChange }: PickerGalleryProps) {
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
          onChange={handleGalleryColorChange}
          picker={picker}
        />
      ))}
    </div>
  );
}
