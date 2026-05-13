import type { CSSProperties } from 'react';
import type { RGBAColor } from '@/types';
import { getPickerClassName } from '@/components/common/styleArchitecture';

type PhotoshopPreviewsProps = {
  rgb: RGBAColor;
  currentColor: string;
};

export function PhotoshopPreviews({ rgb, currentColor }: PhotoshopPreviewsProps) {
  const nextColorStyle: CSSProperties = {
    background: `rgb(${rgb.r},${rgb.g}, ${rgb.b})`,
  };
  const currentColorStyle: CSSProperties = {
    background: currentColor,
  };

  return (
    <div className={getPickerClassName({ block: 'photoshop', slot: 'previews' })}>
      <div className={getPickerClassName({ block: 'photoshop', slot: 'preview-label' })}>new</div>
      <div className={getPickerClassName({ block: 'photoshop', slot: 'preview-swatches' })}>
        <div
          className={getPickerClassName({ block: 'photoshop', slot: 'preview-swatch', modifiers: ['new'] })}
          style={nextColorStyle}
        />
        <div
          className={getPickerClassName({ block: 'photoshop', slot: 'preview-swatch', modifiers: ['current'] })}
          style={currentColorStyle}
        />
      </div>
      <div className={getPickerClassName({ block: 'photoshop', slot: 'preview-label' })}>current</div>
    </div>
  );
}
