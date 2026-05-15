import { bem } from '@/components/common';
import type { HSLAColor } from '@/types';
import './PhotoshopPointerCircle.scss';

type PhotoshopPointerCircleProps = {
  hsl: HSLAColor;
};

const b = bem('photoshop');

export function PhotoshopPointerCircle({ hsl }: PhotoshopPointerCircleProps) {
  return <div className={b('pointer-circle', { 'black-outline': hsl.l > 0.5 })} />;
}
