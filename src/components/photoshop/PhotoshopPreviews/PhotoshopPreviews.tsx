import type { CSSProperties } from 'react';
import { bem } from '@/components/common';
import type { RGBAColor } from '@/types';
import './PhotoshopPreviews.scss';

interface PhotoshopPreviewsProps {
  rgb: RGBAColor;
  currentColor: string;
}

const b = bem('photoshop');

export function PhotoshopPreviews({ rgb, currentColor }: PhotoshopPreviewsProps) {
  const nextColorStyle: CSSProperties = {
    background: `rgb(${rgb.r},${rgb.g}, ${rgb.b})`,
  };
  const currentColorStyle: CSSProperties = {
    background: currentColor,
  };

  return (
    <div className={b('previews')}>
      <div className={b('preview-label')}>new</div>
      <div className={b('preview-swatches')}>
        <div className={b('preview-swatch', { new: true })} style={nextColorStyle} />
        <div className={b('preview-swatch', { current: true })} style={currentColorStyle} />
      </div>
      <div className={b('preview-label')}>current</div>
    </div>
  );
}
