import { bem } from '@/components/common';
import type { HueProps } from '@/components/common';
import './HuePointer.scss';

const b = bem('hue');

type HuePointerProps = Pick<HueProps, 'direction'>;

export function HuePointer({ direction }: HuePointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
