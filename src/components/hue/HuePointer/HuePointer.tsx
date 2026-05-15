import { bem } from '@/components/common';
import type { HueProps } from '@/components/common';
import './HuePointer.scss';

type HuePointerProps = Pick<HueProps, 'direction'>;

const b = bem('hue');

export function HuePointer({ direction }: HuePointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
