import type { CSSProperties } from 'react';
import './PhotoshopPreviews.scss';
import { bem } from '@/components/common';
import type { RGBAColor } from '@/types';

const b = bem('photoshop');

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
    <div className={b('previews').toString()}>
      <div className={b('preview-label').toString()}>new</div>
      <div className={b('preview-swatches').toString()}>
        <div className={b('preview-swatch', { new: true }).toString()} style={nextColorStyle} />
        <div className={b('preview-swatch', { current: true }).toString()} style={currentColorStyle} />
      </div>
      <div className={b('preview-label').toString()}>current</div>
    </div>
  );
}
