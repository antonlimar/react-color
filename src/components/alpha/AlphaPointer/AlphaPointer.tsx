import { bem } from '@/components/common';
import type { AlphaProps } from '@/components/common';
import './AlphaPointer.scss';

type AlphaPointerProps = Pick<AlphaProps, 'direction'>;

const b = bem('alpha');

export function AlphaPointer({ direction }: AlphaPointerProps) {
  return <div className={b('pointer', { vertical: direction === 'vertical' }).toString()} />;
}
