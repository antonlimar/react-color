import './PhotoshopPointerCircle.scss';
import { bem } from '@/components/common';
import type { HSLAColor } from '@/types';

const b = bem('photoshop');

type PhotoshopPointerCircleProps = {
  hsl: HSLAColor;
};

export function PhotoshopPointerCircle({ hsl }: PhotoshopPointerCircleProps) {
  return <div className={b('pointer-circle', { 'black-outline': hsl.l > 0.5 }).toString()} />;
}
