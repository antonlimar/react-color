import type { HueProps } from '@/types';
import { bem } from '@/components/common/styleArchitecture';
import './HuePointer.scss';

const b = bem('hue');

type HuePointerProps = Pick<HueProps, 'direction'>;

export function HuePointer({ direction }: HuePointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
